import {
  Color,
  Graphics,
  Label,
  Node,
  Size,
  UITransform,
  Vec3
} from 'cc';

export type ButtonHandle = {
  node: Node;
  label: Label;
};

export function createPanel(
  parent: Node,
  name: string,
  size: Size,
  color?: Color
): Node {
  const node = new Node(name);
  parent.addChild(node);
  const ui = node.addComponent(UITransform);
  ui.setContentSize(size);

  if (color) {
    const gfx = node.addComponent(Graphics);
    gfx.fillColor = color;
    gfx.rect(-size.width / 2, -size.height / 2, size.width, size.height);
    gfx.fill();
  }

  return node;
}

export function createLabel(
  parent: Node,
  text: string,
  fontSize = 28,
  color = new Color(50, 30, 10, 255)
): Label {
  const node = new Node('Label');
  parent.addChild(node);
  const label = node.addComponent(Label);
  label.string = text;
  label.fontSize = fontSize;
  label.color = color;
  node.setPosition(Vec3.ZERO);
  return label;
}

export function createButton(
  parent: Node,
  text: string,
  size: Size,
  onClick: () => void
): ButtonHandle {
  const node = new Node('Button');
  parent.addChild(node);
  const ui = node.addComponent(UITransform);
  ui.setContentSize(size);

  const gfx = node.addComponent(Graphics);
  gfx.fillColor = new Color(255, 214, 120, 255);
  gfx.rect(-size.width / 2, -size.height / 2, size.width, size.height);
  gfx.fill();

  const label = createLabel(node, text, Math.floor(size.height * 0.4));
  label.node.setPosition(new Vec3(0, 0, 0));

  node.on(Node.EventType.TOUCH_END, (event) => {
    event.stopPropagation();
    onClick();
  });

  return { node, label };
}
