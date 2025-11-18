# E-Challan Pro

E-Challan Pro is a comprehensive traffic management and citation issuance web application. It is designed to streamline the workflow of traffic police officers by integrating digital record-keeping, intelligent offense detection, and vehicle information retrieval into a single, mobile-responsive interface.

## Project Overview

This application replaces traditional paper-based ticketing with a robust digital solution. It features a role-based access system for officers and administrators, real-time dashboard analytics, and an integrated traffic rulebook.

## Key Features

- **Dashboard & Analytics**: Real-time visualization of issued challans, fine collections, and high-risk offense statistics.
- **Smart Citation Issuance**: 
  - Streamlined form with vehicle lookup.
  - Intelligent offense suggestions based on incident descriptions.
  - Automated geolocation tagging.
  - Photo evidence upload.
- **Vehicle Registry Search**: Instant access to vehicle details, insurance validity, and PUC status.
- **Digital Rulebook**: Searchable database of traffic rules and corresponding penalties.
- **Admin Panel**: Full control over user management (employees) and master data (offenses, fines, custom fields).
- **Bilingual Support**: Native support for both English and Hindi languages.
- **Dark Mode**: Fully responsive UI with toggleable dark/light themes.

## Technology Stack

- **Frontend**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Services**: Google GenAI SDK (Gemini 2.5 Flash)
- **State Management**: React Context API
- **Routing**: Custom View-based routing

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/e-challan-pro.git
   cd e-challan-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configuration**
   Create a `.env` file in the root directory and configure your API key:
   ```
   API_KEY=your_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

## License

Distributed under the MIT License. See `LICENSE` for more information.
