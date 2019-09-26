#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
 LANGUAGE=${1:-"typescript"}
# CC_SRC_PATH=github.com/fabcar/go
# if [ "$LANGUAGE" = "node" -o "$LANGUAGE" = "NODE" ]; then
# 	CC_SRC_PATH=/opt/gopath/src/github.com/fabcar/node
# fi

CC_SRC_PATH=/opt/gopath/src/github.com/hyperledger/fabric/fabcar/typescript/src

docker exec -e "CORE_PEER_LOCALMSPID=RSEMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/rseorg.rvbl.com/users/Admin@rseorg.rvbl.com/msp" clirse peer chaincode install -n fabcar -v 1.0 -p "$CC_SRC_PATH" -l "$LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=RSEMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/rseorg.rvbl.com/users/Admin@rseorg.rvbl.com/msp" clirse peer chaincode instantiate -o orderer.rvbl.com:7050 -C mychannel -n fabcar -l "$LANGUAGE" -v 1.0 -c '{"Args":[""]}' #-P "OR ('RSEMSP.member','Org2MSP.member')"
sleep 10
docker exec -e "CORE_PEER_LOCALMSPID=RSEMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/rseorg.rvbl.com/users/Admin@rseorg.rvbl.com/msp" clirse peer chaincode invoke -o orderer.rvbl.com:7050 -C mychannel -n fabcar -c '{"function":"initLedger","Args":[""]}'

printf "\nTotal setup execution time : $(($(date +%s) - starttime)) secs ...\n\n\n"
printf "Start by installing required packages run 'npm install'\n"
printf "Then run 'node enrollAdmin.js', then 'node registerUser'\n\n"
printf "The 'node invoke.js' will fail until it has been updated with valid arguments\n"
printf "The 'node query.js' may be run at anytime once the user has been registered\n\n"
