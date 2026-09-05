import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchChatHistory, sendChatMessage } from '@/lib/api/chat'
import { ChatMessage } from '@/types'

export function useChatHistory() {
  return useQuery({
    queryKey: ['chat', 'history'],
    queryFn: fetchChatHistory,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (text: string) => sendChatMessage(text),
    onMutate: async (newText: string) => {
      await queryClient.cancelQueries({ queryKey: ['chat', 'history'] })
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chat', 'history']) || []

      // Optimistically append user message
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        sender: 'user',
        text: newText,
        timestamp: 'Just now',
      }

      queryClient.setQueryData<ChatMessage[]>(['chat', 'history'], [
        ...previousMessages,
        userMessage,
      ])

      return { previousMessages }
    },
    onSuccess: (assistantReply) => {
      queryClient.setQueryData<ChatMessage[]>(['chat', 'history'], (old = []) => [
        ...old,
        assistantReply,
      ])
    },
    onError: (_err, _vars, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['chat', 'history'], context.previousMessages)
      }
    },
  })
}