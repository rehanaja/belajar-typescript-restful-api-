import { prisma } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Address, User } from "@prisma/client";
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  toAddressResponse,
  UpdateAddressRequest,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { Validation } from "../validation/validation";
import { ContactService } from "./contact-service";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    const createRequest = Validation.validate(
      AddressValidation.CREATE,
      request
    );

    await ContactService.checkContactMustExists(
      user.username,
      request.contact_id
    );

    const record = {
      contact_id: createRequest.contact_id,
      street: createRequest.street ?? null,
      city: createRequest.city ?? null,
      province: createRequest.province ?? null,
      country: createRequest.country,
      postal_code: createRequest.postal_code,
    };

    const address = await prisma.address.create({
      data: record,
    });

    return toAddressResponse(address);
  }

  static async checkAddressMustExists(
    contactId: number,
    addressId: number
  ): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });

    if (!address) {
      throw new ResponseError(404, "Address is not found");
    }

    return address;
  }

  static async get(
    user: User,
    request: GetAddressRequest
  ): Promise<AddressResponse> {
    const getRequest = Validation.validate(AddressValidation.GET, request);

    await ContactService.checkContactMustExists(
      user.username,
      request.contact_id
    );

    const address = await this.checkAddressMustExists(
      getRequest.contact_id,
      getRequest.id
    );

    return toAddressResponse(address);
  }

  static async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    const updateRequest = Validation.validate(
      AddressValidation.UPDATE,
      request
    );

    await ContactService.checkContactMustExists(
      user.username,
      request.contact_id
    );

    await this.checkAddressMustExists(
      updateRequest.contact_id,
      updateRequest.id
    );

    const address = await prisma.address.update({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id,
      },
      data: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id,
        street: updateRequest.street ?? null,
        city: updateRequest.city ?? null,
        province: updateRequest.province ?? null,
        country: updateRequest.country,
        postal_code: updateRequest.postal_code,
      },
    });

    return toAddressResponse(address);
  }

  static async remove(
    user: User,
    request: RemoveAddressRequest
  ): Promise<AddressResponse> {
    const removeRequest = Validation.validate(
      AddressValidation.REMOVE,
      request
    );

    await ContactService.checkContactMustExists(
      user.username,
      request.contact_id
    );

    await this.checkAddressMustExists(
      removeRequest.contact_id,
      removeRequest.id
    );

    const address = await prisma.address.delete({
      where: {
        id: removeRequest.id,
      },
    });

    return toAddressResponse(address);
  }

  static async list(
    user: User,
    contactId: number
  ): Promise<Array<AddressResponse>> {
    await ContactService.checkContactMustExists(user.username, contactId);

    const addresses = await prisma.address.findMany({
      where: {
        contact_id: contactId,
      },
    });

    return addresses.map((a) => toAddressResponse(a));
  }
}
