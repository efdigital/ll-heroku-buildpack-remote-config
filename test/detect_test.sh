#!/bin/sh

. ${BUILDPACK_TEST_RUNNER_HOME}/lib/test_utils.sh

test_detect() {
  cd $BUILDPACK_HOME
  detect
  assertCapturedSuccess
  assertCaptured "heroku-buildpack-remote-config"
}