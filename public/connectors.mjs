/* SPDX-License-Identifier: GPL-3.0-or-later */
export function connectorGroupsFor(board) {
  const available = new Set(board.pins.map(pin => pin.connector).filter(Boolean));
  const groups = (board.diagram?.connectorGroups || []).map(group => ({
    ...group, contacts:group.contacts.filter(contact => available.has(contact))
  })).filter(group => group.contacts.length);
  const grouped = new Set(groups.flatMap(group => group.contacts));
  return [...groups, ...[...available].filter(id => !grouped.has(id)).map(id => ({id, label:id, contacts:[id]}))];
}
