#!/usr/bin/env bash

# Exit immediately if any test fails
# set -e

# Change directory to tests folder
cd "$(dirname "$0")"

# Record start time
START_TIME=$(date +%s)

echo "=================================================="
echo ">>>Running Suite 1: Authentication & Login"
echo "=================================================="
pytest pages/login_step.py -v -s

echo ""
echo "=================================================="
echo ">>>Running Suite 2: Codespace, Monaco & AI Mocking"
echo "=================================================="
pytest pages/codespace_step.py -v -s

echo ""
echo "=================================================="
echo ">>>Running Suite 3: Dashboard & API Hybrid Seeding"
echo "=================================================="
pytest pages/dashboard_step.py -v -s

# Record end time & calculate duration
END_TIME=$(date +%s)
TOTAL_SECONDS=$((END_TIME - START_TIME))
MINUTES=$((TOTAL_SECONDS / 60))
SECONDS=$((TOTAL_SECONDS % 60))

echo ""
echo "=================================================="
echo "ALL E2E AUTOMATION SUITES PASSED SUCCESSFULLY!"
echo "Total Execution Time: ${MINUTES}m ${SECONDS}s (${TOTAL_SECONDS}s total)"
echo "=================================================="


# command to run : ./run_tests.sh
