import conexion from '../database/conexion.js'
import resizeImageBase64 from '../utils/resizeImageBase64.js';

export async function searchReferral(text, iduser, id) {
  const users = await (await conexion.query("SELECT id, nombre_usuario, avatar, id_sponsor, avatar, codigo_pais FROM usuarios WHERE id_progenitor = ($1) OR id = ($1) ORDER BY id_sponsor NULLS FIRST", [iduser])).rows
  function Node(user) {
    this.user = user,
      this.children = [];
  }
  class Tree {
    constructor() {
      this.root = null;
      this.level = 0;
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
  let isParent = false
  for (const object of users) {
    if (object.id === id) isParent = true
    if (isParent) {
      if (object.id_sponsor) {
        if (object.id === id) {
          tree.add(object)
        } else tree.add(object, object.id_sponsor)
      } else tree.add(object)
    }
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
    let usersList = results.filter(object => object.user.nombre_usuario.toLowerCase().includes(text.toLowerCase())).sort((a, b) => a.user.nombre_usuario - b.user.nombre_usuario)
    matchingElement && usersList.filter(object => object.user.nombre_usuario !== text)
    matchingElement && usersList.unshift(matchingElement)
    results = { user: results[0].user, children: usersList.length > 0 ? usersList : 'No user found' }
  } else results[0]
  return { results, last_level: lastLevel, childs_count: childsCount }
}

export async function referralChildren({ iduser, level, id }) {
  let users = await (await conexion.query("SELECT id, nombre_usuario, avatar, id_sponsor, avatar, codigo_pais FROM usuarios WHERE id_progenitor=($1) OR id=($1) ORDER BY id_sponsor NULLS FIRST", [iduser])).rows
  users = await users.map(object => { return { ...object, avatar: resizeImageBase64(100, 100, 60, object.avatar) } })
  function Node(user) {
    this.user = user,
      this.children = [];
  }
  class Tree {
    constructor() {
      this.root = null;
      this.level = 0;
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
  let isParent = false
  for (const object of users) {
    if (object.id === id) isParent = true
    if (isParent) {
      if (object.id_sponsor) {
        if (object.id === id) {
          tree.add(object)
        } else tree.add(object, object.id_sponsor)
      } else tree.add(object)
    }
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