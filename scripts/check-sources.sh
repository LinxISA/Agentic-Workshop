#!/usr/bin/env bash
set -euo pipefail

check_revision() {
  local path="$1"
  local expected="$2"
  local actual
  actual="$(git -C "$path" rev-parse HEAD)"
  if [[ "$actual" != "$expected" ]]; then
    echo "$path: expected $expected, got $actual" >&2
    return 1
  fi
  echo "$path: $actual"
}

check_revision vendor/pto-spec 9574f0293929bf692517dd29de11a8354440c7dc
check_revision vendor/pyCircuit cc0203928b0c078468f2549a2477f891a17552e0
check_revision vendor/LinxCore 2758fb007efccca8b1d4cf869480af99059e9f23
