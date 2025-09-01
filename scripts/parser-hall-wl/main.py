import logging

import argparse
import asyncio

import pandas as pd

from fetcher import fetch
from parser import parse


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s: %(message)s")


def main():
    parser = argparse.ArgumentParser(description='Fetch PDFs behind Azure AD + Duo using Playwright')
    parser.add_argument('--usr', help='UST Username')
    parser.add_argument('--pwd', help='UST Password')

    args = parser.parse_args()

    pdfs = asyncio.run(fetch(args.usr, args.pwd))
    pdfs = {k: parse(v) for k, v in pdfs.items()}
    pdfs = {k: v.assign(type=k) for k, v in pdfs.items()}
    data = pd.concat(pdfs.values(), ignore_index=True)
    data["sid"] = data["sid"].astype(str)
    data["rank"] = data["rank"].astype(int)
    
    print(data.to_json(orient='records'))

if __name__ == "__main__":
    main()