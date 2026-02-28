import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Contacto } from './entities/contacto.entity';
import { ContactoService } from './contacto.service';
import { CreateContactoInput } from './dto/create-contacto.dto';
import { UpdateContactoInput } from './dto/update-contacto.dto';

@Resolver(() => Contacto)
export class ContactoResolver {
  constructor(private readonly contactoService: ContactoService) {}

  @Query(() => [Contacto], { name: 'contactosByTercero' })
  contactosByTercero(@Args('id_tercero') id_tercero: string): Promise<Contacto[]> {
    return this.contactoService.findByTercero(id_tercero);
  }

  @Query(() => Contacto, { name: 'contacto' })
  contacto(@Args('id_contacto') id_contacto: string): Promise<Contacto> {
    return this.contactoService.findOne(id_contacto);
  }

  @Mutation(() => Contacto, { name: 'createContacto' })
  createContacto(@Args('input') input: CreateContactoInput): Promise<Contacto> {
    return this.contactoService.create(input);
  }

  @Mutation(() => Contacto, { name: 'updateContacto' })
  updateContacto(@Args('input') input: UpdateContactoInput): Promise<Contacto> {
    return this.contactoService.update(input);
  }

  @Mutation(() => Boolean, { name: 'removeContacto' })
  removeContacto(@Args('id_contacto') id_contacto: string): Promise<boolean> {
    return this.contactoService.remove(id_contacto);
  }
}
