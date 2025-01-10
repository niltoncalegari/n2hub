# N2-HUB Status & Leaderboard

A web application to monitor specific BattleBit Remastered servers and maintain a scoreboard between Russia and USA.

## 🚀 Features

- Real-time monitoring of specific BattleBit servers
- Scoreboard system with Firebase persistence
- Responsive and interactive interface
- Automatic server status updates every 30 seconds
- Suporte para múltiplas plataformas de jogo

## 🛠️ Technologies

- Next.js 13+
- Firebase/Firestore
- TypeScript
- Bootstrap
- React
- Tailwind CSS

## 📋 Prerequisites

- Node.js 16+
- NPM or Yarn
- Firebase Account

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
   - Copy `.env.example` to `.env.local`
   - Fill in the variables with your Firebase credentials

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## 🌐 Deployment

### Heroku

1. Create a new Heroku application

2. Configure environment variables in Heroku:
   - Settings > Config Vars > Reveal Config Vars
   - Add all variables from `.env.example`

3. Deploy via GitHub or Heroku CLI
```bash
git push heroku main
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── servers/
│   │       └── route.ts         # API route for server data
│   ├── components/
│   │   ├── ScoreCard.tsx       # Scoreboard component
│   │   ├── ServerStatus.tsx    # Server status component
│   │   └── GamePlatformSelector.tsx # Componente para selecionar a plataforma de jogo
│   ├── configs/
│   │   └── firebase.ts         # Firebase configuration
│   ├── globals.css             # Global styles
│   └── page.tsx                # Main page
```

## ⚙️ Configuration

### Monitored Servers

The monitored servers are configured in the `ServerStatus.tsx` component:

```typescript
const serverNames = [
  "[RS] Rogue Soldiers | Hardcore | Conq & Dom | RSClan.gg | Discord.gg/RSclan | 120hz",
  "190-Y-00"
];
```

### Firebase

The project uses Firestore for data persistence. Configure your credentials in the `.env.local` file following the example in `.env.example`.

## 🔒 Security

- Firebase credentials are protected using environment variables
- The `.env.local` file is not committed to the repository
- Use `.env.example` as a reference for required variables
- Implementação de medidas adicionais de segurança para proteger dados do usuário

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
