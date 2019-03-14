#!/bin/sh

. ${BUILDPACK_TEST_RUNNER_HOME}/lib/test_utils.sh

test_detect() {
  detect
  assertCapturedSuccess
  assertCaptured "-----> Node is installed: OK"
}