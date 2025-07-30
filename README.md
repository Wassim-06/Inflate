
## Project Structure

The project follows a scalable and organized folder structure. Here is a brief overview:

- **`src/api/`**: Contains API functions and endpoints integration code. Use this folder for any service or network request abstractions.

- **`src/assets/`**: Stores static files like images, SVGs, fonts, etc.

- **`src/components/`**: Holds reusable React components and UI elements. New components should follow the PascalCase naming convention and be structured to keep presentation and logic as decoupled as possible.

- **`src/data/`**: Includes static data, mock data for testing, and JSON samples for development purposes.

- **`src/lib/`**: Contains utility functions, helper libraries, and common constants used across the application.

## How to install

To set up and run the project locally:

1. **Install dependencies**  
  Run the following command in the project root directory:
  ```bash
  npm install
  ```

2. **Start the development server**  
  After installation, start the app with:
  ```bash
  npm run dev
  ```

The application will be available at the local address shown in your terminal.


## Code Conventions

- **Component Creation**: 
  - Use PascalCase when naming components.
  - Each component should reside in its own file and include appropriate TypeScript interfaces or PropTypes.
  - Keep the component focused on a single responsibility.

- **Commit Guidelines (Conventional Commits)**:
  - **feat**: A new feature
  - **fix**: A bug fix
  - **docs**: Documentation only changes
  - **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
  - **refactor**: A code change that neither fixes a bug nor adds a feature
  - Write clear and concise commit messages following these prefixes.

## Other Important Notes

- Follow ESLint rules as configured in the project for consistent code style.
- Keep the folder organization intact to ensure maintainability as the project grows.
- Ensure that any new feature or fix includes adequate documentation and test cases.
