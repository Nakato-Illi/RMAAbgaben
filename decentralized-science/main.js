document.addEventListener('DOMContentLoaded', function () {
    const walletLink = document.getElementById('wallet-link');
    const createStudyLink = document.querySelector('.create-study-link');
    const walletBubble = document.querySelector('.sprechblase');
    const messagesIcon = document.getElementById('messages');
    const walletAddress = '0x64b...937';
    let isConnected = false;

    walletLink.addEventListener('click', function () {
        closeMessagesPopup(); // Close messages popup if open
        if (isConnected) {
            // Revert to the original text
            walletLink.textContent = 'Connect Wallet';
            walletBubble.style.display = 'none';
            createStudyLink.style.display = 'none';
            isConnected = false;
        } else {
            // Change text and add wallet address
            walletLink.textContent = `Disconnect Wallet (${walletAddress})`;
            walletBubble.style.display = 'block';
            createStudyLink.style.display = 'block';
            isConnected = true;
        }
    });

    messagesIcon.addEventListener('click', function () {
        if (isConnected) {
            // Toggle messages popup
            const messagesPopup = document.getElementById('messages-popup');
            messagesPopup.style.display = (messagesPopup.style.display === 'block') ? 'none' : 'block';
        }
    });
});

function closeMessagesPopup() {
    const messagesPopup = document.getElementById('messages-popup');
    if (messagesPopup.style.display === 'block') {
        messagesPopup.style.display = 'none';
    }
}