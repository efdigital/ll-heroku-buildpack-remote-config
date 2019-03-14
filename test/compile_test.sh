#!/bin/sh

. ${BUILDPACK_TEST_RUNNER_HOME}/lib/test_utils.sh

test_compile_missing_heroku_token() {
  compile
  assertCapturedError
  assertCapturedError "HEROKU_BUILDPACK_REMOTE_CONFIG_API_TOKEN is not set"
}

test_compile_no_apps() {
  echo $TEST_COMPILE_TOKEN > $ENV_DIR/HEROKU_BUILDPACK_REMOTE_CONFIG_API_TOKEN
  compile
  assertCapturedSuccess
  assertCaptured "writing config to"
  assertTrue "output file exists" [ -f "$BUILD_DIR/.heroku-buildpack-remote-config.json" ]
}

test_compile() {
  echo $TEST_COMPILE_TOKEN > $ENV_DIR/HEROKU_BUILDPACK_REMOTE_CONFIG_API_TOKEN
  echo $TEST_COMPILE_APPS > $ENV_DIR/HEROKU_BUILDPACK_REMOTE_CONFIG_APPS
  echo $TEST_COMPILE_KEYS > $ENV_DIR/HEROKU_BUILDPACK_REMOTE_CONFIG_KEYS
  compile
  assertCapturedSuccess
  assertCaptured "writing config to"
  assertTrue "output file exists" [ -f "$BUILD_DIR/.heroku-buildpack-remote-config.json" ]
}