#!/usr/bin/env bash
# Обёртка Maestro: Java 17 из Homebrew + Maestro из ~/.maestro, без аналитики.
export JAVA_HOME="$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$HOME/.maestro/maestro/bin:$PATH"
export MAESTRO_CLI_NO_ANALYTICS=1
export MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=true
exec maestro "$@"
