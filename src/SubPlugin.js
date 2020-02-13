/**
 * Build styles
 */

/**
 *
 * Allows to wrap inline fragment and style it somehow.
 */
class SubPlugin {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {};

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({api}) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'SUB';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    let sub = document.createElement(this.tag);

    // sub.classList.add(SubPlugin.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(sub);
     */
    sub.appendChild(range.extractContents());
    range.insertNode(sub);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(sub);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return '<svg width="20" height="20"><path d="M15 13.75v-7.5h-1.25v7.5h-3.125l3.75 3.75 3.75-3.75z"></path><path d="M6.25 5v3.75h-3.75v-3.75h3.75zM7.5 3.75h-6.25v6.25h6.25v-6.25z"></path><path d="M1.25 12.5h1.875v1.25h-1.875v-1.25z"></path><path d="M3.75 12.5h1.875v1.25h-1.875v-1.25z"></path><path d="M6.25 12.5h1.25v1.875h-1.25v-1.875z"></path><path d="M1.25 16.875h1.25v1.875h-1.25v-1.875z"></path><path d="M3.125 17.5h1.875v1.25h-1.875v-1.25z"></path><path d="M5.625 17.5h1.875v1.25h-1.875v-1.25z"></path><path d="M1.25 14.375h1.25v1.875h-1.25v-1.875z"></path><path d="M6.25 15h1.25v1.875h-1.25v-1.875z"></path></svg>'
  }

  /**
   * Sanitizer rule
   * @return {{sub: {class: string}}}
   */
  static get sanitize() {
    return {
      sub: {}
    };
  }
}

export default SubPlugin;