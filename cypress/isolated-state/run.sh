CYPRESS_COMMAND="npm run cypress:run"  # Update this with your exact Cypress command if different

while true; do
    echo "Starting Cypress test..."
    
    # Run Cypress tests
    $CYPRESS_COMMAND
    
    # Check the exit status of the Cypress command
    if [ $? -eq 0 ]; then
        echo "Cypress test completed successfully. Restarting..."
    else
        echo "Cypress test encountered an error. Restarting..."
    fi
    
    # Optional: wait for a few seconds before restarting
    sleep 1
done