import { prisma } from "../src/application/database";
import bcrypt from "bcrypt";
import { Address, Contact, User } from "@prisma/client";

export class UserTest {
  static async delete() {
    await prisma.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    await prisma.user.create({
      data: {
        username: "test",
        name: "test",
        password: await bcrypt.hash("test", 10),
        token: "test",
      },
    });
  }

  static async get(): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        username: "test",
      },
    });

    if (!user) {
      throw new Error("User is not found");
    }

    return user;
  }
}

export class ContactTest {
  static async deleteAll() {
    await prisma.contact.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    await prisma.contact.create({
      data: {
        first_name: "test",
        last_name: "test",
        email: "test@example.com",
        phone: "08999999",
        username: "test",
      },
    });
  }

  static async get(): Promise<Contact> {
    const contact = await prisma.contact.findFirst({
      where: {
        username: "test",
      },
    });

    if (!contact) {
      throw new Error("Contact is not found");
    }

    return contact;
  }
}

export class AddressTest {
  static async deleteAll() {
    await prisma.address.deleteMany({
      where: {
        contact: {
          username: "test",
        },
      },
    });
  }

  static async create() {
    const contact = await ContactTest.get();
    await prisma.address.create({
      data: {
        contact_id: contact.id,
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "negara test",
        postal_code: "11111",
      },
    });
  }

  static async get(): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: {
        contact: {
          username: "test",
        },
      },
    });

    if (!address) {
      throw new Error("Address is not found");
    }

    return address;
  }
}
