#!/bin/bash
set +e

display_menu() {
    clear
    echo "==============================================="
    echo "        Waf Infrastructure Testing             "
    echo "==============================================="
    echo "1. Deploy Test Infrastructure"
    echo "2. Remove Test Infrastructure"
    echo "Q. Quit"
    echo "==============================================="
}

handle_deploy() {
    echo "Deploying test infrastructure..."

    cdk --app='./lib/integ.default.js' deploy --require-approval never

    lb_description=$(aws elbv2 describe-load-balancers --names "integ-lb")

    # Extract the public DNS name from the description using JQ (JSON processor)
    public_dns=$(echo "$lb_description" | jq -r '.LoadBalancers[0].DNSName')

    # Print the public DNS name
    echo "Load Balancer Public DNS: $public_dns"

    echo "Calling endpoint..."
    curl $public_dns:808

    echo "Test infrastructure deployed!"
    read -p "Press enter to continue..."
}

handle_remove() {
    echo "Removing test infrastructure..."
    
    cdk --app='./lib/integ.default.js' destroy

    echo "Test infrastructure removed!"
    read -p "Press enter to continue..."
}

while true; do
    display_menu
    read -p "Enter your choice: " choice

    case "$choice" in
        1)
            handle_deploy
            ;;
        2)
            handle_remove
            ;;
        q|Q)
            break
            ;;
        *)
            echo "Invalid choice!"
            echo "Stopping..."
            exit 1
            ;;
    esac
done


