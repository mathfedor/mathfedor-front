export const chatService = {
    sendChatMessages: async (messages: any[], token: string) => {
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
    }
}; 
