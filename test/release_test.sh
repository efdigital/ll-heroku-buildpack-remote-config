#!/bin/sh

. ${BUILDPACK_TEST_RUNNER_HOME}/lib/test_utils.sh

test_release_missing_file() {
  cd $BUILDPACK_HOME
  release
  assertCapturedError
  assertCapturedError "config file does not exist"
}

test_release() {
  touch "$BUILD_DIR/.heroku-buildpack-remote-config.json"
  cd $BUILDPACK_HOME
  release
  assertCapturedSuccess
  assertCaptured "deleted config file"
  assertTrue "output file exists" [ ! -f "$BUILD_DIR/.heroku-buildpack-remote-config.json" ]
}