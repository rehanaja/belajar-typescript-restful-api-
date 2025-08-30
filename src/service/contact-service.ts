import { prisma } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Contact, User } from "../generated/prisma";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(
      ContactValidation.CREATE,
      request
    );

    const record = {
      first_name: createRequest.first_name,
      last_name: createRequest.last_name ?? null, // Mengubah undefined ke null
      email: createRequest.email ?? null,
      phone: createRequest.phone ?? null,
      ...{ username: user.username },
    };

    const contact = await prisma.contact.create({
      data: record,
    });

    return toContactResponse(contact);
  }

  static async checkContactMustExists(
    username: string,
    contactId: number
  ): Promise<Contact> {
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
        username: username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, "Contact not found");
    }

    return contact;
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExists(user.username, id);
    return toContactResponse(contact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateRequest = Validation.validate(
      ContactValidation.UPDATE,
      request
    );
    await this.checkContactMustExists(user.username, updateRequest.id);

    const record = {
      id: updateRequest.id,
      first_name: updateRequest.first_name,
      last_name: updateRequest.last_name ?? null,
      email: updateRequest.email ?? null,
      phone: updateRequest.phone ?? null,
    };

    const contact = await prisma.contact.update({
      where: {
        id: updateRequest.id,
        username: user.username,
      },
      data: record,
    });

    return toContactResponse(contact);
  }
}
