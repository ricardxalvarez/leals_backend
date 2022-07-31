import conexion from '../database/conexion.js'

export async function searchReferral(text, id_sponsor) {
  const users = await (await conexion.query("SELECT id, nombre_usuario, avatar, id_sponsor, avatar FROM usuarios WHERE (id=($1) OR id_progenitor=($1)) AND nombre_usuario LIKE $2", [id_sponsor, `%${text}%`])).rows
  return users
}

export async function referralChildren({ iduser, level }) {
  let users = await (await conexion.query("SELECT id, nombre_usuario, avatar, id_sponsor, avatar FROM usuarios WHERE id_progenitor=($1) OR id=($1)", [iduser])).rows
  function Node(user) {
    this.user = user,
      this.children = [];
  }
  class Tree {
    constructor() {
      this.root = null;
      this.level = 1;
    }
    add(data, toNodeData) {
      const node = new Node(data);

      const parent = toNodeData ? this.findBFS(toNodeData) : null;
      if (parent) {
        if (parent.children[parent.children.length - 1]) {
          if (parent.children[parent.children.length - 1].user.id_sponsor === node.user.id_sponsor) {
            parent.children.push({ ...node, user: { ...node.user, level: this.level } })
          } else {
            this.level++;
            parent.children.push({ ...node, user: { ...node.user, level: this.level } })
          }
        } else {
          this.level++;
          parent.children.push({ ...node, user: { ...node.user, level: this.level } })
        }
      } else {
        if (!this.root) {
          this.root = { ...node, user: { ...node.user, level: this.level } };
        } else return 'Tried to store node at root when root already exists'
      }
    }

    findBFS(data) {
      let _node = null
      this.traverseBFS((node) => {
        console.log(node)
        if (node?.user.id === data) {
          _node = node
        }
      })

      return _node
    }

    traverseBFS(cb) {
      const queue = [this.root]
      if (cb) {
        while (queue.length) {
          const node = queue.shift()

          cb(node)

          for (const child of node?.children) {
            queue.push(child)
          }
        }
      }
    }
  }

  let tree = new Tree()
  let results = []
  let lastLevel
  for (const object of users) {
    if (object.id_sponsor) {
      tree.add(object, object.id_sponsor)
    } else tree.add(object)
  }
  tree.traverseBFS((node) => {
    results.push(node)
  })
  lastLevel = results[results.length - 1].user.level
  if (level) {
    results = results.filter(object => object.user.level === level)
  } else results = results[0]
  return { results, last_level: lastLevel }
}