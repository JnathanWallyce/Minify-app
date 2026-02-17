import { GoogleGenAI } from "@google/genai";
import { UserRole } from "../types";

const getSystemInstruction = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "Você é um consultor administrativo experiente para igrejas. Ajude com estatísticas, redação de avisos, gestão de membros e organização de eventos. Seja formal, preciso e encorajador.";
    case UserRole.TEACHER:
      return "Você é um assistente pedagógico para escola bíblica. Ajude a criar esboços de aulas, explicar passagens bíblicas complexas de forma didática, sugerir dinâmicas para alunos e organizar cronogramas. Seja criativo e biblicamente preciso.";
    case UserRole.STUDENT:
      return "Você é um mentor de estudos bíblicos amigável. Ajude o aluno a entender versículos, tire dúvidas sobre teologia básica, sugira planos de leitura e ore (escreva orações) por eles se pedirem. Use linguagem acessível e acolhedora.";
    default:
      return "Você é um assistente útil para uma igreja.";
  }
};

export const sendMessageToGemini = async (
  message: string,
  role: UserRole,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Erro: API Key não configurada. Por favor, verifique suas configurações.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Use gemini-2.5-flash for fast responses
    const model = "gemini-2.5-flash";

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: getSystemInstruction(role),
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({
      message: message,
    });

    return result.text || "Desculpe, não consegui gerar uma resposta.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.";
  }
};