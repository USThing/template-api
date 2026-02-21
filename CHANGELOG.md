# Changelog

## [0.1.0](https://github.com/USThing/template-api/compare/v0.2.5...v0.1.0) (2026-02-21)


### Features

* add common fastify plugins ([096d1be](https://github.com/USThing/template-api/commit/096d1be31bce62a217aa3f9ce809a4fa8751b567))
* **auth:** add schema for auth pre-handler ([4cd7932](https://github.com/USThing/template-api/commit/4cd7932fca9d455faa19c41736d3170a1877df89))
* **auth:** introduce new verification mechanism ([9bcb72f](https://github.com/USThing/template-api/commit/9bcb72f48634084159c8fa53d5a7ed9bfecdf252))
* **auth:** support legacy authentication ([47a8e4a](https://github.com/USThing/template-api/commit/47a8e4a77ca299924fb53038427859c7984a1324))
* **build:** copy non-TS test assets into dist during build ([6e94419](https://github.com/USThing/template-api/commit/6e9441985f0dfa1a15cad729756ff18071cccebd))
* create plugin to initialize mongo db ([d1887e0](https://github.com/USThing/template-api/commit/d1887e00977ab2a2cf48a874d7d3423cc1cb7c4c))
* **format:** sort imports ([4ced54e](https://github.com/USThing/template-api/commit/4ced54ec09d250e9322c813b58284a9ef0f4410a))
* generate a new fastify project ([6dce800](https://github.com/USThing/template-api/commit/6dce8006e78c4a331dd62095c06e056a89907f29))
* install and upgrade packages ([47283d4](https://github.com/USThing/template-api/commit/47283d48f8f09f2c85659cc6b1b71c4734869f87))
* **openapi:** add scalar reference ([3722a8e](https://github.com/USThing/template-api/commit/3722a8e7ee3700e6ec213639a37f1156b4f1e5de))
* **sensible:** add http error examples with sensible ([60cf5c1](https://github.com/USThing/template-api/commit/60cf5c1223255a56b52028fe445bc1f6d98be27e))
* support auth ([eb60fa3](https://github.com/USThing/template-api/commit/eb60fa31c7bdab9d683a9bb17c61f0de6d417e76))
* support typed mongo collections ([d337149](https://github.com/USThing/template-api/commit/d3371494c4afe507d1b481c38d39de4355aee8c6))


### Bug Fixes

* add `FastifyServerOptions` to `AppOptions` ([d833b07](https://github.com/USThing/template-api/commit/d833b07d075381cc8e5157fa3743eb83b93259b7))
* **auth:** check invalid authorization header ([3e0251d](https://github.com/USThing/template-api/commit/3e0251d28fd7dbfd7eb0a21337c6f638d6022187))
* **auth:** correctly parse `AUTH_SKIP` environment variable ([830a610](https://github.com/USThing/template-api/commit/830a610700b5c4616aa28838f485c1e4bf5632ab))
* **auth:** remove unused decoration ([c4370f0](https://github.com/USThing/template-api/commit/c4370f0a75f0cf3168121fed6c3a1d6123e33949))
* **auth:** respond meaningful message on failure ([ed59059](https://github.com/USThing/template-api/commit/ed59059e183b1e9c0fa4403325794bea3fe76093))
* **ci:** grant pull-requests read permission for commitlint action ([7769387](https://github.com/USThing/template-api/commit/77693870178ec52b6b29d1348a0d32cb28ed3c73))
* **ci:** move continue-on-error to callers of shared steps ([045c292](https://github.com/USThing/template-api/commit/045c292d96af0afd526b9b0bf7e38837b395dcee))
* **ci:** pass continue_on_error to shared steps and remove invalid job-level flag ([5cda12c](https://github.com/USThing/template-api/commit/5cda12cd3aa8fe166b8d55f0eccb9810ecdcdaa7))
* **ci:** use `failure()` condition for fallback jobs ([b24a487](https://github.com/USThing/template-api/commit/b24a487fe6f61df922dd17a0c9e65fd8dfaad47a))
* **ci:** use `self-hosted` runner label for fallback ([c1f5f35](https://github.com/USThing/template-api/commit/c1f5f35f3b37a0e5873c90222c0be31e2f7cb886))
* configure tests to adapt auth plugin ([b8074dd](https://github.com/USThing/template-api/commit/b8074ddcc9143965880845255150c3eb89cff833))
* **deps:** dependabot config ([e82fde0](https://github.com/USThing/template-api/commit/e82fde06a795b4f0fda8a5a28048bc2e272029f5))
* mongo uri is required ([a3980aa](https://github.com/USThing/template-api/commit/a3980aa6dab73a52c1a8ce06bc575582a7cf82b2))
* **pkg:** add `"private": true` to prevent accidental publish ([dd6fd28](https://github.com/USThing/template-api/commit/dd6fd2854a9e74fa3ceef8405ddca81a0a6d0915))
* **test:** let test recognize server options ([845b5cc](https://github.com/USThing/template-api/commit/845b5ccf3a4308d78a696a0b28fe6d27757b4b5f))


### Miscellaneous Chores

* **deps:** update typebox ([df07cf7](https://github.com/USThing/template-api/commit/df07cf77a559c4bb073b63e2ad6ed7e4b8f1603b))
* **main:** set version to 0.1.0 ([d9758fd](https://github.com/USThing/template-api/commit/d9758fd15bd1ca02f02e6fb81ba4bcd814839e61))
* **release-please:** reset versioning ([430218a](https://github.com/USThing/template-api/commit/430218aa5b91ba2c0f567d0139db2321a76250fb))


### Tests

* support testing with mongo db ([a62e916](https://github.com/USThing/template-api/commit/a62e91669d127dc8b79e3846c5cf09303098ba9f))
