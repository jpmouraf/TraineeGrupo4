const itensPermitidos = ["id", "email", "name", "photo", "role"];

export const selectItems = Object.fromEntries(
	itensPermitidos.map(item => [item, true])
);