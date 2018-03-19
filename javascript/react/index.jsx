import React, { Component } from "react";

class SelectInput extends Component {
  render() {
    const { selectItem, isActive, onClickHeader, placeholder } = this.props;
    const { text } = selectItem;
    return (
      <div>
        <div onClick={onClickHeader}>
          <Input type="text" value={text} placeholder={placeholder} />
        </div>
      </div>
    );
  }
}

const searchDecorator = WrappedComponent => {
  class SearchDecorator extends Component {
    constructor(props) {
      super(props);
      this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(keyword) {
      this.setState({
        data: this.props.data,
        keyword
      });
      this.props.onSearch(keyword);
    }

    render() {
      const { data, keyword } = this.state;
      return (
        <WrappedComponent
          {...this.props}
          data={data}
          keyword={keyword}
          onSearch={this.handleSearch}
        />
      );
    }
  }

  return SearchDecorator;
};

const asyncSelectDecorator = WrappedComponent => {
  class AsyncSelectDecorator extends Component {
    componentDidMount() {
      const { url, params } = this.props;
      fetch(url, { params }).then(data => {
        this.state({ data });
      });
    }

    render() {
      return <WrappedComponent {...this.props} data={this.state.data} />;
    }
  }

  return AsyncSelectDecorator;
};

const FinalSelector = compose(
  asyncSelectDecorator,
  searchDecorator,
  selectedItemDecorator
)(Selector);

class SearchSelect extends Component {
    shouldComponentUpdate(){

    }
  render() {
    return (
      <FinalSelector {...this.props}>
        <SelectInput />
        <SearchInput />
        <List />
      </FinalSelector>
    );
  }
}

function shallowEqual(obj,newObj){
    if(obj===newObj){
        return true;
    }

    const objKeys = Object.keys(obj);
    const newObjKeys = Object.keys(newObj);

    if(objKeys.length !== newObjKeys.length){
        return false;
    }

    //关键代码,只需要关注props中每一个是否相等,无需深入判断
    return objKeys.every(key=>{
        return newObj[key] === obj[key];
    })
}

export default SelectInput;
