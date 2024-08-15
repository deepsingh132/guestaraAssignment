# **Menu Management Application**

This is a Node.js backend application for managing a menu that includes categories, subcategories, and items. The application allows CRUD operations for categories, subcategories, and items, and provides search functionality for items by name in the menu.

## **Postman API Documentation link**: https://documenter.getpostman.com/view/26609332/2sA3s7iopL

## **Features**

- Create, update, retrieve, and delete categories, subcategories, and items.
- Items can be associated directly with a category or with a subcategory under a category.
- Search items by name.
- Documentation available via Postman.

## **Technologies Used**

- **Node.js** with **Express.js**
- **TypeScript**
- **Prisma ORM** for database management
- **PostgreSQL** as the database
- **Docker** (optional for local development)

## **Getting Started**

### **File Structure**

The project is structured as follows:

- `dist`: Contains the compiled JavaScript files.
- `prisma`: Contains the Prisma schema and migrations.
- `src`: Contains the source code for the application.
  - `controllers`: Contains the route handlers for the API endpoints.
  - `routes`: Contains the API routes.

### **Prerequisites**

To run this application, you need to have the following installed on your machine:

- Node.js (v16+)
- PostgreSQL
- Docker (optional)

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/deepsingh/guestaraAssignment.git
   cd guestaraAssignment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```bash
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public"
   PORT=5000
   ```

   Replace `<username>`, `<password>`, and `<database_name>` with your PostgreSQL credentials and database name.

4. **Set up the database:**
   - Run the Prisma migration to create the required tables:

     ```bash
     npx prisma migrate dev --name init
     ```

   - Optionally, you can use Prisma Studio to explore your database visually:

     ```bash
     npx prisma studio
     ```

      Prisma Studio will open in your browser at `http://localhost:5555`.

   - Generate Prisma Client to access the database:

      ```bash
      npx prisma generate
      ```

5. **Run the application:**

   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5000`.

### **API Documentation**

- You can test the API endpoints using Postman or similar tools. Import the provided Postman collection.
- The API routes include:
  - `/categories`: Create, get, edit, and delete categories.
  - `/subcategories`: Create, get, edit, and delete subcategories.
  - `/items`: Create, get, edit, and delete items.

### **Running with Docker**

If you prefer using Docker to run the application and the database, follow these steps:

1. **Build and run the application:**
   - Ensure you have Docker installed and running on your system.
   - Use the following command to build and run the application:

     ```bash
     docker-compose up --build
     ```

   This will spin up both the PostgreSQL database and the application in containers.

2. **Access the application:**
   The application will be available at `http://localhost:3000`.

### **Scripts**

- **`npm run dev`**: Run the application in development mode with live reload.
- **`npm run build`**: Compile TypeScript to JavaScript and generate the `dist` folder.
- **`npm start`**: Run the compiled JavaScript application in production mode.
- **`npx prisma migrate dev`**: Run database migrations.
- **`npx prisma studio`**: Open Prisma Studio to interact with the database.

### **Testing**

You can use Postman to manually test the API endpoints. A Postman collection is provided in the repository. You can import the collection and test the endpoints.

### **Questions**

- Which database you have chosen and why?

  - I have chosen PostgreSQL as the database for this application. PostgreSQL is a powerful, open-source relational database system that provides robust features and is widely used in production environments. It supports complex queries, indexing, and data integrity constraints, making it suitable for applications that require a structured data model.

- 3 things that you learned from this assignment?

  - **Prisma ORM**: I learned how to use Prisma ORM to interact with the database in a Node.js application. Prisma simplifies database access by providing a type-safe API for database operations and generating database client code based on the data model defined in the Prisma schema.

  - **API Documentation**: I learned how to create API documentation using Postman. Documenting APIs is essential for developers to understand how to interact with the application and test the endpoints. Postman provides a user-friendly interface for creating and sharing API documentation.

  - **Hierarchical Data Structure**: I learned how to model a hierarchical data structure for managing categories, subcategories, and items in a menu application. Designing the data model to represent relationships between entities and implementing CRUD operations for hierarchical data required careful planning and consideration of the application requirements.

- What was the most difficult part of the assignment?

  - The most difficult part of the assignment was designing the data model to represent the hierarchical structure of the menu (categories, subcategories, and items) and implementing the CRUD operations for managing the menu items. Handling the relationships between categories, subcategories, and items and ensuring data consistency and integrity required careful planning and implementation.

- What would you do differently if you had more time?

  - **Authentication and Authorization**: Implement user authentication and authorization to secure the API endpoints. This would involve adding user registration, login, and role-based access control to restrict access to certain routes based on user roles.

  - **Unit Testing**: Write unit tests to ensure the reliability and correctness of the application. Unit testing helps identify bugs and issues early in the development process and ensures that the application functions as expected.

  - **Pagination and Filtering**: Implement pagination and filtering for large datasets to improve performance and user experience. Pagination allows users to navigate through large sets of data, while filtering enables users to search and retrieve specific data based on criteria.

  - **Error Handling**: Enhance error handling by implementing custom error messages and status codes for different types of errors. Proper error handling helps users understand and resolve issues when interacting with the application.

  - **Performance Optimization**: Optimize the application for performance by caching data, optimizing database queries, and improving response times. Performance optimization is crucial for ensuring that the application can handle a large number of requests efficiently.

  - **Frontend Application**: Develop a frontend application to interact with the API and provide a user-friendly interface for managing the menu. A frontend application would allow users to view, add, edit, and delete categories, subcategories, and items in the menu.

  - **Monitoring and Logging**: Implement monitoring and logging to track application performance, errors, and user activity. Monitoring helps identify issues and bottlenecks in the application, while logging provides a record of events for debugging and auditing purposes.

  - **Security**: Enhance security by implementing measures such as data encryption, input validation, and secure communication protocols. Security is essential for protecting sensitive data and preventing security vulnerabilities in the application.

  - **Internationalization**: Add support for multiple languages and locales to make the application accessible to users from different regions. Internationalization involves translating text, formatting dates, and numbers, and adapting the application to different cultural norms.

  - **Scalability**: Design the application to be scalable by using best practices such as load balancing, horizontal scaling, and caching. Scalability ensures that the application can handle increased traffic and data volume as the user base grows.

### **Contact**

For any inquiries, please contact [mandeeparora132@gmail.com](mailto:mandeeparora132@gmail.com).

---
