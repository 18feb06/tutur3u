import { TrashIcon } from '@heroicons/react/24/solid';
import { Product } from '../../types/primitives/Product';
import { NumberInput } from '@mantine/core';
import { useEffect } from 'react';
import SettingItemCard from '../settings/SettingItemCard';
import ProductSelector from '../selectors/ProductSelector';
import UnitSelector from '../selectors/UnitSelector';
import WarehouseSelector from '../selectors/WarehouseSelector';

interface Props {
  wsId: string;
  product: Product;
  isLast: boolean;

  getUniqueWarehouseIds: () => string[];
  updateProduct: (product: Product) => void;
  removePrice: () => void;

  hideStock?: boolean;
}

const InvoiceProductInput = ({
  wsId,
  product: p,

  getUniqueWarehouseIds,
  updateProduct,
  removePrice,

  hideStock = false,
}: Props) => {
  useEffect(() => {
    const validProduct = p.id && p.unit_id && p.warehouse_id;
    const hasData =
      p.price !== null && p.price !== '' && p.stock !== null && p.stock !== '';

    if (!validProduct || hideStock) return;
    if (hasData) return;

    fetch(
      `/api/workspaces/${wsId}/inventory/products/${p.id}/warehouses/${p.warehouse_id}/${p.unit_id}`
    )
      .then((res) => res.json())
      .then((product) => {
        const stock = product?.amount;
        const price = product?.price;

        if (price === undefined || stock === undefined) return;

        updateProduct({
          ...p,
          stock,
          price,
          amount: (p?.amount || 1) > stock ? stock : 1,
        });
      });
  }, [wsId, p, hideStock, updateProduct]);

  return (
    <SettingItemCard
      title={
        p?.price != null && p?.price != ''
          ? Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(Number(p?.price * (p?.amount || 0)))
          : 'Chưa có đơn giá'
      }
      description={
        p?.price != null && p?.price != ''
          ? p?.amount === 0
            ? 'Chưa có số lượng'
            : `${Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(Number(p.price))} x ${Intl.NumberFormat('vi-VN').format(
                Number(p?.amount || 0)
              )}`
          : 'Chờ chọn sản phẩm và nhập số lượng'
      }
    >
      <div className="flex gap-2">
        <div className="grid w-full gap-2 xl:grid-cols-3">
          <ProductSelector
            productId={p.id}
            setProductId={(id) =>
              updateProduct({
                ...p,
                id,
                unit_id: '',
                warehouse_id: '',
                price: '',
                stock: '',
                amount: '',
              })
            }
          />

          <UnitSelector
            unitId={p.unit_id}
            setUnitId={(id) =>
              updateProduct({
                ...p,
                unit_id: id,
                warehouse_id: '',
                price: '',
                stock: '',
                amount: '',
              })
            }
            customApiPath={
              p.id
                ? `/api/workspaces/${wsId}/inventory/products/${p.id}/units`
                : null
            }
            creatable={false}
            disabled={!p.id}
          />

          <WarehouseSelector
            warehouseId={p.warehouse_id}
            setWarehouseId={(id) =>
              updateProduct({
                ...p,
                warehouse_id: id,
                price: '',
                stock: '',
                amount: '',
              })
            }
            customApiPath={
              p.id && p.unit_id
                ? `/api/workspaces/${wsId}/inventory/products/${p.id}/units/${
                    p.unit_id
                  }/warehouses?blacklist=${getUniqueWarehouseIds().join(',')}`
                : null
            }
            creatable={false}
            disabled={!p.id || !p.unit_id}
          />

          {p?.warehouse_id === undefined || p?.warehouse_id === '' ? (
            <div className="col-span-full rounded border border-orange-300/20 bg-orange-300/10 p-4 text-center font-semibold text-orange-300">
              Chờ nhập dữ liệu.
            </div>
          ) : p?.price === '' || p?.stock === '' ? (
            <div className="col-span-full rounded border border-orange-300/20 bg-orange-300/10 p-4 text-center font-semibold text-orange-300">
              Đang tải dữ liệu...
            </div>
          ) : p?.stock === 0 ? (
            <div className="col-span-full rounded border border-red-300/20 bg-red-300/10 p-4 text-center font-semibold text-red-300">
              Sản phẩm đã hết hàng.
            </div>
          ) : (
            <>
              {hideStock || (
                <NumberInput
                  label="Tồn kho"
                  placeholder={
                    p.warehouse_id ? 'Đang tải...' : 'Chờ chọn sản phẩm'
                  }
                  value={p.stock}
                  min={0}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
                  formatter={(value) =>
                    !Number.isNaN(parseFloat(value || ''))
                      ? (value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : ''
                  }
                  disabled
                />
              )}

              <NumberInput
                label="Giá sản phẩm"
                placeholder={
                  p.warehouse_id ? 'Đang tải...' : 'Chờ chọn sản phẩm'
                }
                value={p.price}
                min={0}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value || ''))
                    ? (value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : ''
                }
                disabled
              />

              <NumberInput
                label="Số lượng"
                placeholder={
                  p?.stock && p?.price
                    ? 'Nhập số lượng'
                    : p.warehouse_id
                    ? 'Chờ tải giá'
                    : 'Chờ chọn sản phẩm'
                }
                value={p.amount}
                onChange={(val) =>
                  p.id && p.unit_id
                    ? updateProduct({ ...p, amount: val })
                    : undefined
                }
                min={0}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value || ''))
                    ? (value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : ''
                }
                disabled={
                  p.stock === null || p.stock === null || p?.stock === 0
                }
                max={hideStock ? undefined : p.stock || 0}
                className={hideStock ? 'xl:col-span-2' : ''}
              />
            </>
          )}
        </div>

        <button
          className="mt-[1.6125rem] h-fit rounded border border-red-300/10 bg-red-300/10 px-1 py-1.5 font-semibold text-red-300 transition hover:bg-red-300/20 md:px-4"
          onClick={removePrice}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </SettingItemCard>
  );
};

export default InvoiceProductInput;