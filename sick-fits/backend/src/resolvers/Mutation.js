const Mutations = {
	async createItem(parent,args,ctx,info) {
		// TODO: CHECK TO SEE IF USER IS LOGGED IN
		const item = await ctx.db.mutation.createItem({
			data: { ...args}
		}, info)

		return item
	}
};

module.exports = Mutations;
