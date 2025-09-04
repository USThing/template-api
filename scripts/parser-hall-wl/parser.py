from io import BytesIO
import logging
import pandas as pd
import pdfplumber

log = logging.getLogger("parser")

def parse(pdf: bytes) -> pd.DataFrame:
    data = []

    with pdfplumber.open(BytesIO(pdf)) as doc:
        for i, page in enumerate(doc.pages, start=1):
            try:
                raw_tables = page.extract_tables()
            except Exception as e:
                log.warning("page %s: pdfplumber.extract_tables failed: %s", i, e)
                raw_tables = []

            for tidx, table in enumerate(raw_tables):
                try:
                    match True:
                        case _ if any('Male' in cell for cell in table[0] if cell):
                            data.extend(row + ['M'] for row in table[1:])
                        case _ if any('Female' in cell for cell in table[0] if cell):
                            data.extend(row + ['F'] for row in table[1:])
                except Exception as e:
                    log.debug("failed to convert table on page %s idx %s: %s", i, tidx, e)

    df = pd.DataFrame(data, columns=["sid", "rank", 'sex'])
    df["sid"] = pd.to_numeric(df["sid"].str.replace(r"\D", "", regex=True), errors="raise")
    df["rank"] = pd.to_numeric(df["rank"].str.replace(r"\D", "", regex=True), errors="raise")
    df = df.sort_values(by=["rank"], ascending=[True], na_position="last").reset_index(drop=True)
    df["sid"] = df["sid"].astype(str).str.strip()
    df = df.dropna(how="any")
    df["rank"] = df["rank"].astype(int)

    # Validation: 
    # 1. SID must be unique.
    # 2. Rank must be continuous, starting at 1 and ending at len(data)

    # Validation 1: SID must be unique
    if df["sid"].duplicated().any():
        dup = df[df["sid"].duplicated()].sort_values("sid")
        dup_counts = dup["sid"].value_counts()
        log.error(
            "SID uniqueness violation: %d duplicate SID(s). Examples: %s",
            int(dup_counts.sum()),
            dup_counts.head().to_dict(),
        )

    # Validation 2: Rank must be continuous from 1 to len(data)
    n = len(df)
    # get integer ranks present (drop any NA)
    try:
        ranks = df["rank"].dropna().astype(int).sort_values().tolist()
    except Exception as e:
        log.error("Failed to coerce Rank to integers for continuity check: %s", e)
        ranks = []

    expected = list(range(1, n + 1))
    if ranks != expected:
        missing = sorted(set(expected) - set(ranks))
        extra = sorted(set(ranks) - set(expected))
        log.error(
            "Rank continuity violation: expected ranks 1..%d. Missing: %s. Extra/unexpected: %s",
            n,
            missing,
            extra,
        )

    return df
