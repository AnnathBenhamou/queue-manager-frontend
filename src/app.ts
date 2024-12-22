import axios from 'axios';
import './styles.css';


const API_BASE_URL = 'http://127.0.0.1:5000';

interface QueueData {
    [queueName: string]: number;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchQueues();

    const fetchMessageButton = document.getElementById('fetch-message') as HTMLButtonElement;
    fetchMessageButton.addEventListener('click', fetchMessage);
});

async function fetchQueues(): Promise<void> {
    try {
        const response = await axios.get(`${API_BASE_URL}/queues`);
        console.log('Fetched queues:', response.data);
        const queues = response.data;

        // Populate the queue list and dropdown
        const queueList = document.getElementById('queue-list')!;
        const queueSelect = document.getElementById('queue-select') as HTMLSelectElement;

        queueList.innerHTML = ''; // Clear previous data
        queueSelect.innerHTML = ''; // Clear dropdown

        for (const [queueName, messageCount] of Object.entries(queues)) {
            // Render queues in the list
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.textContent = `${queueName}: ${messageCount} messages`;
            queueList.appendChild(queueItem);

            // Add queues to the dropdown
            const option = document.createElement('option');
            option.value = queueName;
            option.textContent = queueName;
            queueSelect.appendChild(option);
        }

        // Show a message if no queues are available
        if (Object.keys(queues).length === 0) {
            queueList.innerHTML = '<p>No queues available. Add a message to create a queue!</p>';
        }
    } catch (error) {
        console.error('Error fetching queues:', error);
    }
}

async function fetchMessage(): Promise<void> {
    const queueSelect = document.getElementById('queue-select') as HTMLSelectElement;
    const queueName = queueSelect.value;

    if (!queueName) {
        alert('Please select a queue.');
        return;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/api/${queueName}`);
        const queueResponse = document.getElementById('queue-response')!;

        if (response.status === 204) {
            queueResponse.textContent = 'No messages available.';
        } else {
            queueResponse.textContent = JSON.stringify(response.data, null, 2);
        }
    } catch (error) {
        console.error('Failed to fetch message:', error);
    }
}
