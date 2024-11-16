export const insertItem = async (env: Env, name: string) => {
  return await env.DB.prepare("INSERT INTO items (name) VALUES (?) RETURNING *")
                        .bind(name)
                        .first();
};
