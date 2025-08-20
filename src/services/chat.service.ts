interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const chatService = {
    sendChatMessages: async (messages: ChatMessage[], token: string) => {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/chat`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ messages })
        });
        if (!response.ok) throw new Error('Error al enviar el mensaje');
        return response.json();
    },
    studyPlan: async (messages: ChatMessage[], token: string) => {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/chat/study-plan`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ messages })
        });
        if (!response.ok) throw new Error('Error al enviar el mensaje');
        return response.json();
    }
}; 
