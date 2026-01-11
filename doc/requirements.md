# Frontend Interview Assignment - Real-time Chat Application

## Objective

Develop a **multi-user real-time chat application** that displays a "Conversation List" and "Chat Room Content" using React as the foundation.

---

## Requirements

### Conversation List

1. Display all conversations with different users
2. Each conversation should show:
   - Participant info (avatar + name)
   - Last message
   - Message timestamp
3. Clicking a conversation navigates to the chat room view

### Chat Room

1. Display complete chat history
2. Support text messages, images, and system messages
3. Each message should include:
   - Sender info (avatar + name)
   - Message content (text / image)
   - Reactions (like, love, laugh)
   - Message timestamp
4. Allow inputting and sending messages (local simulation, no backend required)

---

## Technical Requirements

1. **Must use React** (Next.js is also acceptable)
2. **Technology choices are flexible** (Tailwind / Styled Components / Zustand / Redux are all acceptable)
3. **No backend required** — use Mock API (JSON files provided)

---

## Mock API

Please download and use the following JSON as Mock Data.

### API Structure

#### GET

- `/conversations` — Fetch conversation list
- `/messages?conversationId={id}` — Fetch messages for a specific conversation

#### POST

- `/conversations/:id/messages/create` — Create a new message

---

## Evaluation Criteria

| Criteria | Description |
|----------|-------------|
| **Basic Completion** | Complete UI that meets all requirements |
| **Code Structure** | Good component separation and readability |
| **State Management** | Can use `useState` / `useContext` / Zustand (not mandatory) |
| **UI/UX** | Clear and user-friendly design |

---

## Bonus Points

- **Real-time message update effect** (e.g., simulate WebSocket with `setTimeout`)
- **Message reactions** (like / love / laugh)
- **Image lazy loading**
- **Dark mode**

---

## Extra Challenge (Optional)

- **Backend DB Design**: If you have the capability to implement a complete backend, feel free to take on the challenge!