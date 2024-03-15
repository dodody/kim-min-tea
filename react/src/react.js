export function createDOM(node){
  if(typeof node === 'string'){
    return document.createTextNode(node) ; 
  }
    const element= document.createElement(node.tag);

    Object.entries(node.props)
      .forEach(([name, value]) => element.setAttribute(name, value));

    node.children
      .map(createDOM)
      .forEach(element.appendChild.bind(element));
  
    return element;
  }

export function createElement(tag, props, ...children){
  // children을 가변인자로 받으면 배열로만들어진다?
  // 미친 이렇게 펼치니까 배열이 만들어졌어.. 
  console.log('children', children)
  return { tag, props, children }
}

export function render(vdom, container){
  container.appendChild(createDOM(vdom)); 
}
