import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({
		length: 50
	})
	email!: string

	@Column({
		length: 20
	})
	password!: string

	constructor(email: string, password: string) {
		this.email = email
		this.password = password
	}

	getEmail(): string {
		return this.email
	}

	getId(): number {
		return this.id
	}

	getPassword(): string {
		return this.password
	}
}
