import prisma from "../prisma/client.js";

class userRepository {
  async create(data) {
    return await prisma.user.create({
      data,
    });
  }

  async findAll(
    filters = {},
    sortBy = "id",
    sortOrder = "asc",
    page = 1,
    pageSize = 10
  ) {
    // Ensure the page and page size are positive integers
    page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
  
    // Get total number of users that match the filters
    const totalCount = await prisma.user.count({
      where: filters,
    });
  
    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / pageSize);
  
    const query = {
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    };
  
    // Add dynamic filtering conditions if filters are provided
    if (Object.keys(filters).length > 0) {
      query.where = {};
  
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "string") {
            query.where[key] = { contains: value, mode: "insensitive" };
          } else if (typeof value === "boolean") {
            query.where[key] = { equals: value };
          } else if (typeof value === "number") {
            query.where[key] = { equals: value };
          }
        }
      }
    }
  
    const users = await prisma.user.findMany(query);
  
    // Return the data along with pagination information
    return {
      data: users,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  }
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

export default new userRepository();