/* @flow */
import React, { Component } from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import logo from './logo.svg';
import './App.css';

type Item = {
  id: number,
  text: string,
};

type FilterType = 'all' | 'odd' | 'even';

type RequiredProps = {
};

type DefaultProps = {
  items: Array<Item>,
  filtersByType: { [FilterType]: (item: Item) => boolean },
};

type Props = RequiredProps & DefaultProps;

type State = {
  filterType: FilterType,
  sorted: boolean,
  clearingCache: boolean,
  items: Array<Item>,
};

const itemCount = 1000;
const defaultItems = [];
for (let i = 0; i < itemCount; i++) {
  defaultItems.push({ id: i + 1, text: `item ${i + 1}` });
}

for(let i = defaultItems.length - 1; i > 0; i--){
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = defaultItems[i];
    defaultItems[i] = defaultItems[r];
    defaultItems[r] = tmp;
}

const rowHeight = 60;

const itemsStyle = {
  border: '1px solid #ccc',
  borderBottom: 'none',
  borderRadius: 4,
};

const itemStyle = {
  boxSizing: 'border-box',
  lineHeight: `${rowHeight}px`,
  borderBottom: '1px solid #ccc',
};

class App extends Component<DefaultProps, Props, State> {

  static defaultProps = {
    items: defaultItems,
    filtersByType: {
      all: ({ id }: Item) => true,
      odd: ({ id }: Item) => id % 2 === 1,
      even: ({ id }: Item) => id % 2 === 0,
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      filterType: 'all',
      sorted: false,
      clearingCache: false,
      items: this.props.items,
    };
  }

  list: List;

  stateDidUpdate = async () => {
    const { filterType, sorted } = this.state;
    await this.updateItems(filterType, sorted);
    if (this.list != null && this.state.clearingCache) {
      this.list.recomputeRowHeights();
    }
  };

  updateItems(filterType: FilterType, sorted: boolean): Promise<void> {
    const { items, filtersByType } = this.props;
    let filteredItems = items.filter(filtersByType[filterType]);

    if (sorted) {
      filteredItems = filteredItems.sort((i1: Props, i2: Props) => i1.id - i2.id);
    }

    return new Promise((resolve) => {
      this.setState({ items: filteredItems }, resolve);
    });
  }

  renderRadios() {
    const { filterType } = this.state;
    const inputs = ['all', 'odd', 'even'].map(type => (
      <label key={type}>
        <input
          type="radio"
          value={type}
          checked={filterType === type}
          onChange={(e) => this.setState({ filterType: type }, this.stateDidUpdate)}
        />
        { type }
      </label>
    ));
    return (
      <div>
        { inputs }
      </div>
    );
  }

  renderItems() {
    const items = this.state.items;

    return (
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <AutoSizer disableHeight >
            {({ width }) => (
              <List
                {...{ width, height, isScrolling, scrollTop, rowHeight }}
                ref={(c) => { this.list = c; }}
                style={itemsStyle}
                overscanRowCount={10}
                rowCount={items.length}
                rowRenderer={this.renderItem}
                autoHeight
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }

  renderItem = ({
    index,
    key,
    style,
  }: any) => {
    const { id, text } = this.state.items[index];
    return (
      <div key={id} style={Object.assign({}, itemStyle, style)}>{ text }</div>
    );
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <section className="App-intro">
          <label>
            <input
              type="checkbox"
              checked={this.state.sorted}
              onChange={(e) => {
                this.setState({ sorted: e.target.checked }, this.stateDidUpdate);
              }}
            />
            sort
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.clearingCache}
              onChange={(e) => {
                this.setState({ clearingCache: e.target.checked }, this.stateDidUpdate);
              }}
            />
            clear cache
          </label>
          { this.renderRadios() }
          { this.renderItems() }
        </section>
      </div>
    );
  }
}

export default App;
