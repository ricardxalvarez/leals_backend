import conexion from '../database/conexion.js'
import resizeImageBase64 from '../utils/resizeImageBase64.js';

export async function searchReferral(text, id_progenitor, id) {
  const tempUsers = await (await conexion.query("SELECT id, nombre_usuario, full_nombre, id_sponsor, avatar, codigo_pais FROM usuarios WHERE id_progenitor = ($1) OR id = ($1) ORDER BY id_sponsor NULLS FIRST", [id_progenitor])).rows
  const users = []
  for (let i = 0; i < tempUsers.length; i++) {
    const user = tempUsers[i];
    const avatar = await resizeImageBase64(60, 60, 70, user.avatar)
    const newObject = { ...user, avatar: avatar || null }
    users.push(newObject)
  }
  function Node(user) {
    this.user = user,
      this.children = [];
  }
  class Tree {
    constructor() {
      this.root = null;
    }
    add(data, toNodeData) {
      const node = new Node(data);
      const parent = toNodeData ? this.findBFS(toNodeData) : null;
      if (parent) {
        parent.children.push({ ...node, user: { ...node.user, level: parent.user.level + 1 } })
      } else {
        if (!this.root) {
          this.root = { ...node, user: { ...node.user, level: 0 } };
        } else return 'Tried to store node at root when root already exists'
      }
    }

    findBFS(data) {
      let _node = null
      this.traverseBFS((node) => {
        if (node) {
          if (node.user.id === data) {
            _node = node
          }
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
          for (const child of node.children) {
            queue.push(child)
          }
        }
      }
    }
  }
  let tree = new Tree()
  let results = []
  let lastLevel
  let isChild = false
  for (const object of users) {
    if (object.id_sponsor === id) isChild = true
    if (object.id == id) {
      tree.add(object)
    } else if (object.id_sponsor && isChild) tree.add(object, object.id_sponsor)
  }
  tree.traverseBFS((node) => {
    results.push(node)
  })
  lastLevel = results[results.length - 1].user.level
  let count = results[results.length - 1].user.level < 10 ? 10 : results[results.length - 1].user.level
  const childsCount = [];
  for (let i = 1; i <= count; i++) {
    const element = results.filter(object => object.user.level === i);
    childsCount.push(element.length)
  }
  if (text) {
    const matchingElement = results.find(object => object.user.nombre_usuario === text)
    results = { user: results[0].user, children: [matchingElement].filter(e => e) }
  } else results[0]
  return { results, last_level: lastLevel, childs_count: childsCount }
}

export async function referralChildren({ id_progenitor, level, id }) {
  const tempUsers = await (await conexion.query("SELECT id, nombre_usuario, full_nombre, avatar, id_sponsor, codigo_pais FROM usuarios WHERE id_progenitor=($1) OR id=($1) ORDER BY id_sponsor NULLS FIRST", [id_progenitor])).rows
  const users = []
  let results = []
  for (let i = 0; i < tempUsers.length; i++) {
    const user = tempUsers[i];
    const avatar = await resizeImageBase64(60, 60, 70, user.avatar)
    const newObject = { ...user, avatar: avatar || null }
    users.push(newObject)
  }
  function Node(user) {
    this.user = user,
      this.children = [];
  }
  class Tree {
    constructor() {
      this.root = null;
    }
    add(data, toNodeData) {
      const node = new Node(data);
      const parent = toNodeData ? this.findBFS(toNodeData) : null;
      if (parent) {
        parent.children.push({ ...node, user: { ...node.user, level: parent.user.level + 1 } })
      } else {
        if (!this.root) {
          this.root = { ...node, user: { ...node.user, level: 0 } };
        } else return 'Tried to store node at root when root already exists'
      }
    }

    findBFS(data) {
      let _node = null
      this.traverseBFS((node) => {
        if (node) {
          if (node.user.id === data) {
            _node = node
          }
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
          for (const child of node.children) {
            queue.push(child)
          }

        }
      }
    }
  }

  let tree = new Tree()
  let lastLevel
  let isChild = false
  for (const object of users) {
    if (object.id_sponsor === id) isChild = true
    if (object.id == id) {
      tree.add(object)
    } else if (object.id_sponsor && isChild) tree.add(object, object.id_sponsor)
  }
  tree.traverseBFS((node) => {
    results.push(node)
  })
  lastLevel = results[results.length - 1].user.level
  let count = results[results.length - 1].user.level < 10 ? 10 : results[results.length - 1].user.level
  const childsCount = [];
  for (let i = 1; i <= count; i++) {
    const element = results.filter(object => object.user.level === i);
    childsCount.push(element.length)
  }
  if (level > 0) {
    results = { user: results[0].user, children: results.filter(object => object.user.level === level) }
  } else results = results[0]
  return { results, last_level: lastLevel, childs_count: childsCount }
}