# EventChain

**EventChain** is a blockchain-based ticket management system designed to secure event ticketing and validation processes. This project is currently **under development** as part of my bachelor's thesis.

## Project Overview

EventChain leverages blockchain technology to create a secure, tamper-proof ticketing system. Users can purchase event tickets, which are generated as QR codes and stored in the blockchain. Event organizers can validate tickets in real-time using a mobile application to scan and invalidate QR codes.

### Key Features:
- **Blockchain Integration**: Ticket information is securely stored in a blockchain, ensuring authenticity.
- **QR Code Generation**: Each ticket is assigned a unique QR code for easy scanning and validation.
- **Real-Time Validation**: Event organizers can validate tickets at the event through a mobile app that interacts with the blockchain.
- **MongoDB for Event and User Data**: MongoDB is used for storing user profiles, event information, and ticket metadata.

## Technologies
- **Frontend**: React (for the event organizer web interface)
- **Backend**: Node.js, Express
- **Database**: MongoDB (for user and event data)
- **Blockchain**: Hyperledger (for ticket management and security)
- **Mobile**: React Native (for mobile apps)

## Installation

### Prerequisites
- Node.js
- MongoDB
- Hyperledger Fabric

### Clone the Repository
```bash
git clone https://github.com/yourusername/eventchain.git
cd eventchain

## Install Dependencies
```bash
npm install
