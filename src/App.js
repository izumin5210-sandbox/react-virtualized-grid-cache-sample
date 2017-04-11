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
    };
  }

  getItems() {
    const { items, filtersByType } = this.props;
    const { filterType, sorted } = this.state;
    let filteredItems = items.filter(filtersByType[filterType]);

    if (!sorted) {
      return filteredItems;
    }

    return filteredItems.sort((i1: Props, i2: Props) => i1.id - i2.id);
  }

  renderRadios() {
    const { filterType } = this.state;
    const inputs = ['all', 'odd', 'even'].map(type => (
      <label key={type}>
        <input
          type="radio"
          value={type}
          checked={filterType === type}
          onChange={(e) => this.setState({ filterType: type })}
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
    const items = this.getItems();

    return (
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <AutoSizer disableHeight >
            {({ width }) => (
              <List
                {...{ width, height, isScrolling, scrollTop, rowHeight }}
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
    const { id, text } = this.getItems()[index];
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
                this.setState({ sorted: e.target.checked });
              }}
            />
            sort
          </label>
          { this.renderRadios() }
          { this.renderItems() }
        </section>
      </div>
    );
  }
}

export default App;
