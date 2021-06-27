import styled from "styled-components";

export const ReactTableContainer = styled.div`
  /* margin: 2rem; */
  /* padding: 2rem; */
  ${'' /* These styles are suggested for the table fill all available space in its containing element */}
  display: block;
  ${'' /* These styles are required for a horizontaly scrollable table overflow */}
  overflow: auto;

  .sha-table {
    border-spacing: 0;
    border: 1px solid #ddd;

    .thead {
      ${'' /* These styles are required for a scrollable body to align with the header properly */}
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tbody {
      ${'' /* These styles are required for a scrollable table body */}
      /* overflow-y: scroll;
      height: 250px; */
      overflow-x: hidden;

      .sha-table-empty {
        display: flex;
        height: 250px;
        justify-content: center;
        align-items: center;
      }
    }

    .tr {
      &.tr-head {
        box-shadow: 0 2px 15px 0 rgb(0 0 0 / 15%);
      }

      &.tr-body {
        &:not(.sha-tr-selected) {
          &:hover {
            background: rgba(0, 0, 0, 0.03);
          }
        }
      }

      :last-child {
        .td {
          border-bottom: 0;
        }
      }
      /* border-bottom: 1px solid black; */

      &.tr-odd {
        background: rgba(0, 0, 0, 0.03);
      }

      &.sha-tr-selected {
        background: #0066c1;
        color: white;
      }
    }

    .th {
      &.sorted-asc {
        border-top: 3px solid black;
      }
      &.sorted-desc {
        border-bottom: 3px solid black;
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-right: 1px solid rgba(0, 0, 0, 0.05);

      ${'' /* In this example we use an absolutely position resizer,
       so this is required. */}
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        /* right: 0;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1; */
        ${'' /* prevents from scrolling while dragging on touch devices */}
        /* touch-action :none; */

        &.isResizing {
          background: gray;
        }

        height: 100%;
        background: rgba(0, 0, 0, 0.05);
        touch-action :none;
        display: inline-block;
        position: absolute;
        width: 1px;
        top: 0;
        bottom: 0;
        right: -0.5px;
        cursor: col-resize;
        z-index: 10;
      }
    }

    .td {
      word-wrap: break-word;
    }
  }
`