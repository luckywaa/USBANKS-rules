// ==UserScript==
// @name         TopCashback Cashback CNY Display
// @namespace    http://tampermonkey.net/
// @version      1.2
// @match        *://www.topcashback.cn/account/earnings*
// @match        *://www.topcashback.com/account/earnings*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const RATE = 6.6; // 固定汇率

    // 注入样式
    const style = document.createElement('style');
    style.textContent = `
        .tcb-cny {
            display: block;
            color: #d71e28;
            font-size: 12px;
            font-weight: bold;
            margin-top: 2px;
        }
        .tcb-cny-total {
            display: block;
            color: #d71e28;
            font-size: 13px;
            font-weight: bold;
            margin-top: 4px;
        }
        /* 订单号列 */
        .tcb-order-id {
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 12px;
            color: #444;
            word-break: break-all;
            user-select: all;
        }
        .tcb-order-id-header {
            text-align: left;
        }
    `;
    document.head.appendChild(style);

    // 从 "$15.48" 或 "329.90" 提取数字并换算
    function formatCny(usdText) {
        const num = parseFloat(usdText.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return null;
        return '￥' + (num * RATE).toFixed(2);
    }

    // 新增订单号列：插在"商家"列之后（第二列）
    function addOrderIdColumn() {
        const table = document.querySelector('#datatable-earnings-table');
        if (!table) return;

        // 1. thead：表头加"订单号"
        const theadRow = table.querySelector('thead tr');
        if (theadRow && !theadRow.querySelector('.tcb-order-id-header')) {
            const th = document.createElement('th');
            th.className = 'tcb-order-id-header no-sort sorting_disabled';
            th.rowSpan = 1;
            th.colSpan = 1;
            th.innerHTML = '<span>订单号</span>';
            const merchantTh = theadRow.querySelector('th.merchant');
            if (merchantTh && merchantTh.nextElementSibling) {
                theadRow.insertBefore(th, merchantTh.nextElementSibling);
            } else {
                theadRow.appendChild(th);
            }
        }

        // 2. tfoot：对应位置加空 th（保持列对齐）
        const tfootRow = table.querySelector('tfoot tr');
        if (tfootRow && !tfootRow.querySelector('.tcb-order-id-foot')) {
            const th = document.createElement('th');
            th.className = 'tcb-order-id-foot';
            th.rowSpan = 1;
            th.colSpan = 1;
            const firstTh = tfootRow.querySelector('th');
            if (firstTh && firstTh.nextElementSibling) {
                tfootRow.insertBefore(th, firstTh.nextElementSibling);
            }
        }

        // 3. 数据行：插入订单号 td
        table.querySelectorAll('tbody tr').forEach(tr => {
            if (tr.classList.contains('shown-child')) {
                // 展开详情行：colspan 5 → 6
                const td = tr.querySelector('td[colspan]');
                if (td && td.getAttribute('colspan') === '5') {
                    td.setAttribute('colspan', '6');
                }
                return;
            }
            if (tr.querySelector('.tcb-order-id')) return; // 已注入
            const orderId = tr.getAttribute('data-order-id');
            if (!orderId) return;
            const td = document.createElement('td');
            td.className = 'tcb-order-id';
            td.textContent = orderId;
            const merchantTd = tr.querySelector('td.merchant');
            if (merchantTd && merchantTd.nextElementSibling) {
                tr.insertBefore(td, merchantTd.nextElementSibling);
            }
        });
    }

    // 重入保护 + 防抖：避免 MutationObserver 回调修改 DOM 再次触发 observer 导致死循环
    let isDrawing = false;
    let pendingTimer = null;

    function draw() {
        if (isDrawing) return;
        isDrawing = true;
        try {
            // 0. 注入订单号列
            addOrderIdColumn();

            // 1. 处理每行返利金额：<div class="transaction-amount">$15.48</div>
            document.querySelectorAll('.transaction-amount').forEach(el => {
                // 已注入过则跳过（检查下一个兄弟节点）
                if (el.nextElementSibling && el.nextElementSibling.classList.contains('tcb-cny')) return;

                const cny = formatCny(el.textContent);
                if (!cny) return;

                const badge = document.createElement('div');
                badge.className = 'tcb-cny';
                badge.textContent = cny;
                el.after(badge);
            });

            // 2. 处理 tfoot 总计：<th class="cb">$<span>329.90</span></th>
            // 读取 span 里的原始金额（不包含已注入的 badge），避免文本污染
            const tfootCb = document.querySelector('tfoot th.cb');
            if (tfootCb) {
                const amountSpan = tfootCb.querySelector('span');
                // 优先用 span 的文本，回退到整个 th 的文本（但先移除旧 badge）
                let usdText = '';
                if (amountSpan) {
                    usdText = amountSpan.textContent;
                } else {
                    tfootCb.querySelectorAll('.tcb-cny-total').forEach(b => b.remove());
                    usdText = tfootCb.textContent;
                }

                const existingBadge = tfootCb.querySelector('.tcb-cny-total');
                const cny = formatCny(usdText);
                if (!cny) {
                    if (existingBadge) existingBadge.remove();
                } else if (!existingBadge) {
                    const badge = document.createElement('div');
                    badge.className = 'tcb-cny-total';
                    badge.textContent = cny;
                    tfootCb.appendChild(badge);
                } else if (existingBadge.textContent !== cny) {
                    // 金额变化才更新，避免每次都重建触发 mutation
                    existingBadge.textContent = cny;
                }
            }
        } finally {
            isDrawing = false;
        }
    }

    function scheduleDraw() {
        if (pendingTimer) clearTimeout(pendingTimer);
        pendingTimer = setTimeout(() => {
            pendingTimer = null;
            draw();
        }, 100);
    }

    const run = () => {
        new MutationObserver(scheduleDraw).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        draw();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
