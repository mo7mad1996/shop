"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

// libs
import { units as AllUnits } from "~/lib/details";

// icons
import { FaPlus } from "react-icons/fa6";
import { GrDocumentStore } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import { TbCategoryFilled } from "react-icons/tb";
import { IoIosSave } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaBarcode } from "react-icons/fa6";

// components
import * as Dialog from "@/components/ui/dialog";
import * as Progress from "@/components/ui/progress";
import * as MenuUI from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";
import InputField from "~/components/layouts/role/InputField";
import SelectField from "~/components/layouts/role/SelectField";
import PageHeader from "~/components/layouts/role/PageHeader";
import { HStack } from "@chakra-ui/react";
import { IconButton } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

// main component
export default function Inventory() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/product");
      const { data } = res;
      setProducts(data);
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      setCategoriesLoading(true);
      const res = await axios.get("/api/category");
      const { data } = res;
      setCategories(data);
      getProducts();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // init
  useEffect(() => {
    getCategories();
  }, []);

  // render
  return (
    <>
      <PageHeader title="المخزن" icon={<GrDocumentStore />}>
        <AddProduct action={getProducts} categories={categories} />
      </PageHeader>

      <List
        {...{ categories, loading, categoriesLoading, products, getCategories }}
      />
    </>
  );
}

// components
function AddProduct({ categories, action }) {
  const [open, setOpen] = useState(false);

  // methods
  const addProduct = async (payload, cb) => {
    try {
      const res = await axios.post("/api/product", payload);
      setOpen(false);
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      cb();
    }
  };

  // render
  return (
    <Dialog.DialogRoot
      open={open}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Dialog.DialogTrigger asChild>
        <button
          className="btn"
          disabled={categories.length == 0}
          onClick={() => setOpen(true)}
        >
          <span>اضف منتج</span>
          <FaPlus />
        </button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <header className="flex my-3 gap-2 items-center text-xl text-bold">
              <FaPlus />

              <span>اضف منتج</span>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          {/* content here */}
          <ProductForm categories={categories} action={addProduct} />
        </Dialog.DialogBody>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}

function List({
  categories,
  loading,
  categoriesLoading,
  products: list,
  getCategories,
}) {
  const [category, setCategory] = useState("all");
  const [onlyShowEmpty, setOnlyShowEmpty] = useState(false);

  return (
    <>
      <h2 className="text-gray-500 mt-12 mb-5">قائمة الاصناف وكمياتها.</h2>

      {categoriesLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-4 gap-4 py-6">
          <aside className="col-span-1 rounded">
            <SimpleTreeView
              onItemClick={(e, itemId) =>
                setCategory(() => (itemId == "category" ? "all" : itemId))
              }
              defaultExpandedItems={["category", "all"]}
              defaultSelectedItems={["all"]}
            >
              <TreeItem
                itemId="category"
                label={
                  <div className="flex items-center justify-between">
                    <span>الاقسام</span>
                    <DialogAddCategory action={getCategories} />
                  </div>
                }
                slots={{
                  expandIcon: IoIosArrowBack,
                }}
              >
                <TreeItem
                  itemId="all"
                  label="الكل"
                  slots={{
                    icon: TbCategoryFilled,
                  }}
                />

                {categories.map((c, n) => (
                  <TreeItem
                    key={n}
                    itemId={c.name}
                    value={c.name}
                    className="group"
                    label={
                      <div className="flex items-center justify-between">
                        <span>{c.name}</span>

                        <ListCategory category={c} action={getCategories} />
                      </div>
                    }
                    slots={{
                      icon: TbCategoryFilled,
                    }}
                  />
                ))}
              </TreeItem>
            </SimpleTreeView>
            <hr className="my-4" />
            <Switch
              checked={onlyShowEmpty}
              onCheckedChange={(e) => setOnlyShowEmpty(e.checked)}
            >
              عرض على وشك النفاذ فقط
            </Switch>
          </aside>
          <main className="col-span-3">
            {loading ? (
              <Loader />
            ) : (
              <ul className="grid grid-cols-2 gap-6 ">
                {list
                  .filter((i) =>
                    category != "all" ? i.category.name == category : true
                  )
                  .filter((i) => (onlyShowEmpty ? i.min >= i.store : true))
                  .map((item) => (
                    <Item
                      key={item._id}
                      item={item}
                      action={getCategories}
                      categories={categories}
                    />
                  ))}
              </ul>
            )}
          </main>
        </div>
      )}
    </>
  );
}

function Item({ item, action, categories }) {
  const [unit, setUnit] = useState(0);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const units = AllUnits[item.unit || 0];

  const deleteProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.delete("/api/product/" + item._id);

      setIsDeleteOpen(false);
      action();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (payload, cb) => {
    try {
      setLoading(true);
      const res = await axios.patch("/api/product/" + item._id, payload);

      setIsUpdateOpen(false);
      action();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
      cb();
    }
  };

  return (
    <li className=" col-span-1 rounded-xl bg-[#f5f7f9] overflow-hidden">
      <div className="bg-white p-4 rounded-xl border border-[#e0e2e6] relative z-[1]">
        <header className="flex justify-between mb-8">
          <div>
            <h1>{item.name}</h1>
          </div>
          <div className="flex-center gap-1 text-gray-500 p-1 border rounded-full">
            <IconButton
              aria-label="barcode"
              size="small"
              onClick={() => {
                window.open(
                  `/manager/product/barcode/${item.barcode}?header=no`,
                  "_blank"
                );
              }}
            >
              <FaBarcode fontSize="inherit" />
            </IconButton>

            <Dialog.DialogRoot
              open={isUpdateOpen}
              placement="center"
              motionPreset="slide-in-bottom"
            >
              <Dialog.DialogTrigger asChild>
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={(e) => {
                    setIsUpdateOpen(true);
                  }}
                >
                  <MdOutlineModeEditOutline fontSize="inherit" />
                </IconButton>
              </Dialog.DialogTrigger>
              <Dialog.DialogContent>
                <Dialog.DialogHeader>
                  <Dialog.DialogTitle>
                    <header className="flex my-3 gap-2 items-center text-xl text-bold">
                      <MdOutlineModeEditOutline />

                      <span>تعديل المنتج </span>
                      <q className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded">
                        {item.name}
                      </q>
                    </header>
                    <hr />
                  </Dialog.DialogTitle>
                  <Dialog.DialogCloseTrigger
                    onClick={() => setIsUpdateOpen(false)}
                  />
                </Dialog.DialogHeader>
                <Dialog.DialogBody>
                  {/* form component */}
                  <ProductForm
                    categories={categories}
                    action={updateProduct}
                    initValues={item}
                  />
                </Dialog.DialogBody>
              </Dialog.DialogContent>
            </Dialog.DialogRoot>

            <Dialog.DialogRoot
              open={isDeleteOpen}
              role="alertdialog"
              motionPreset="slide-in-bottom"
            >
              <Dialog.DialogTrigger asChild>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <MdDelete fontSize="inherit" />
                </IconButton>
              </Dialog.DialogTrigger>
              <Dialog.DialogContent>
                <Dialog.DialogHeader>
                  <Dialog.DialogTitle>
                    <header className="flex my-3 gap-2 items-center text-xl text-bold">
                      <MdDelete />

                      <span>حذف المنتج </span>
                      <q className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded">
                        {item.name}
                      </q>
                    </header>
                    <hr />
                  </Dialog.DialogTitle>
                  <Dialog.DialogCloseTrigger
                    onClick={() => setIsDeleteOpen(false)}
                  />
                </Dialog.DialogHeader>
                <Dialog.DialogBody>
                  <p>هل انت متاكد من حذف {item.name} من النظام ؟</p>
                </Dialog.DialogBody>

                <Dialog.DialogFooter>
                  <Dialog.DialogActionTrigger asChild>
                    <Button
                      className="px-4 py-2 w-22 rounded border"
                      onClick={() => setIsDeleteOpen(false)}
                    >
                      لا
                    </Button>
                  </Dialog.DialogActionTrigger>
                  <Button
                    className="bg-red-500 w-22 text-white px-4 py-2 rounded"
                    onClick={deleteProduct}
                    loading={loading}
                  >
                    نعم
                  </Button>
                </Dialog.DialogFooter>
              </Dialog.DialogContent>
            </Dialog.DialogRoot>
          </div>
        </header>
        <main className="flex justify-between mb-12">
          <div>
            <h3 className="text-2xl">
              {item.store * units[unit].conversionFactor}
              <span className="text-[#555] text-xs px-2">
                {units[unit].symbol}
              </span>
            </h3>
          </div>
          <div>
            <div className="text-xs">
              <span className="text-[#555] px-2">وحدة القياس</span>

              <select
                value={unit}
                onChange={(e) => setUnit(+e.target.value)}
                className="border-2 cursor-pointer border-[#e0e2e6]  rounded-full p-2 px-5 bg-transparent"
              >
                {units.map((i, n) => (
                  <option value={n} key={n}>
                    {i.name} `{i.symbol}`
                  </option>
                ))}
              </select>
            </div>
          </div>
        </main>

        <div>
          <Progress.ProgressRoot
            size="lg"
            value={Math.max(0, Math.min(100, (item.store * 100) / item.max))}
            colorPalette={item.min > item.store ? "red" : "green"}
            variant={item.min > item.store ? "subtle" : "outline"}
          >
            <HStack gap="5">
              <Progress.ProgressBar flex="1" className="rounded-full" />
              <Progress.ProgressValueText>
                {((item.store * 100) / item.max).toFixed(2)}%
              </Progress.ProgressValueText>
            </HStack>
          </Progress.ProgressRoot>
        </div>
      </div>
      <div className="border border-[#e0e2e6] p-4 rounded-xl relative pt-10 mt-[-30px] z-0">
        <div className="flex gap-4 items-center text-[#585a5c]">
          <TbCategoryFilled />
          <span>{item.category?.name}</span>
        </div>
      </div>
    </li>
  );
}

function DialogAddCategory({ action }) {
  const [open, setOpen] = useState(false);

  const addCategory = async (payload, cb) => {
    try {
      const res = await axios.post("/api/category", payload);
      setOpen(false);
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      cb();
    }
  };

  return (
    <Dialog.DialogRoot
      open={open}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Dialog.DialogTrigger asChild>
        <div
          className="text-green-700 px-1"
          onClick={(e) => {
            e.stopPropagation();

            setOpen(true);
          }}
        >
          <FaPlus />
        </div>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <header className="flex my-3 gap-2 items-center text-xl text-bold">
              <FaPlus />
              <span>أضف قسم جديد</span>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          <CategoryForm action={addCategory} />
        </Dialog.DialogBody>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}

function CategoryForm({ action, initValues = {} }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: initValues,
  });

  // methods
  const submit = (payload) => {
    setLoading(true);

    action(payload, () => setLoading(false));
  };

  // render
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit(submit)}>
        <InputField
          label="القسم"
          required
          placeholder="اسم القسم."
          register={{ ...register("name") }}
        />

        <Button type="submit" className="btn w-full" loading={loading}>
          <span>حفظ</span>

          <IoIosSave />
        </Button>
      </form>
    </div>
  );
}

function ListCategory({ category, action }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteCategory = async () => {
    try {
      setLoading(true);
      const res = await axios.delete("/api/category/" + category._id);

      setIsDeleteOpen(false);
      action();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (payload, cb) => {
    try {
      setLoading(true);
      const res = await axios.patch("/api/category/" + category._id, payload);

      setIsUpdateOpen(false);
      action();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.error || err.message);
    } finally {
      cb();
      setLoading(false);
    }
  };

  return (
    <MenuUI.MenuRoot>
      <MenuUI.MenuTrigger asChild>
        <div className="group-hover:opacity-100 opacity-0 transition-all px-1">
          <HiOutlineDotsVertical />
        </div>
      </MenuUI.MenuTrigger>

      <MenuUI.MenuContent>
        <MenuUI.MenuItemGroup>
          <Dialog.DialogRoot
            open={isUpdateOpen}
            placement="center"
            motionPreset="slide-in-bottom"
          >
            <Dialog.DialogTrigger asChild>
              <MenuUI.MenuItem
                value="edit"
                onClick={(e) => {
                  setIsUpdateOpen(true);
                }}
              >
                <MdOutlineModeEditOutline />
                <span>تعديل</span>
              </MenuUI.MenuItem>
            </Dialog.DialogTrigger>
            <Dialog.DialogContent>
              <Dialog.DialogHeader>
                <Dialog.DialogTitle>
                  <header className="flex my-3 gap-2 items-center text-xl text-bold">
                    <MdOutlineModeEditOutline />

                    <span>تعديل القسم </span>
                    <q className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded">
                      {category.name}
                    </q>
                  </header>
                  <hr />
                </Dialog.DialogTitle>
                <Dialog.DialogCloseTrigger
                  onClick={() => setIsUpdateOpen(false)}
                />
              </Dialog.DialogHeader>
              <Dialog.DialogBody>
                {/* form component */}
                <CategoryForm action={updateCategory} initValues={category} />
              </Dialog.DialogBody>
            </Dialog.DialogContent>
          </Dialog.DialogRoot>

          <Dialog.DialogRoot
            open={isDeleteOpen}
            role="alertdialog"
            motionPreset="slide-in-bottom"
          >
            <Dialog.DialogTrigger asChild>
              <MenuUI.MenuItem
                onClick={() => {
                  setIsDeleteOpen(true);
                }}
                value="delete"
              >
                <MdDelete />
                <span>حذف</span>
              </MenuUI.MenuItem>
            </Dialog.DialogTrigger>
            <Dialog.DialogContent>
              <Dialog.DialogHeader>
                <Dialog.DialogTitle>
                  <header className="flex my-3 gap-2 items-center text-xl text-bold">
                    <MdDelete />

                    <span>حذف القسم </span>
                    <q className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded">
                      {category.name}
                    </q>
                  </header>
                  <hr />
                </Dialog.DialogTitle>
                <Dialog.DialogCloseTrigger
                  onClick={() => setIsDeleteOpen(false)}
                />
              </Dialog.DialogHeader>
              <Dialog.DialogBody>
                <p>هل انت متاكد من حذف {category.name} من النظام ؟</p>
              </Dialog.DialogBody>

              <Dialog.DialogFooter>
                <Dialog.DialogActionTrigger asChild>
                  <Button
                    className="px-4 py-2 w-22 rounded border"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    لا
                  </Button>
                </Dialog.DialogActionTrigger>
                <Button
                  className="bg-red-500 w-22 text-white px-4 py-2 rounded"
                  onClick={deleteCategory}
                  loading={loading}
                >
                  نعم
                </Button>
              </Dialog.DialogFooter>
            </Dialog.DialogContent>
          </Dialog.DialogRoot>
        </MenuUI.MenuItemGroup>
      </MenuUI.MenuContent>
    </MenuUI.MenuRoot>
  );
}

function ProductForm({ categories, action, initValues = {} }) {
  const [loading, setLoading] = useState(false);

  const { register, watch, handleSubmit } = useForm({
    defaultValues: { max: 9999, unit: 0, ...initValues },
  });

  // methods
  const submit = (payload) => {
    setLoading(true);

    action(
      {
        ...payload,
        barcode: payload.barcode || Math.ceil(Math.random() * Date.now()),
        store: payload.store / payload.s_unit,
        purchase_price: payload.purchase_price / payload.a_unit,
        selling_price: payload.selling_price / payload.b_unit,
      },
      () => setLoading(false)
    );
  };

  const items = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const unitsList = AllUnits.map((u, n) => {
    const label = u.map((i) => i.name).join(" - ");
    return {
      label,
      value: n,
    };
  });

  const s_unit = AllUnits[+watch("unit") || 0].map((i) => ({
    label: i.name,
    value: i.conversionFactor,
  }));

  // render
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit(submit)}>
        <SelectField
          label="القسم"
          items={items}
          register={{ ...register("category") }}
        />
        <InputField
          label="اسم الصنف"
          required
          placeholder="اسم الصنف."
          register={{ ...register("name") }}
        />
        <SelectField
          label="وحدة قياسها"
          items={unitsList}
          register={{ ...register("unit") }}
        />
        <div className="flex">
          <InputField
            label="الكميه الفعليه الموجوده"
            type="number"
            placeholder="الكميه للصنف."
            register={{ ...register("store") }}
          />

          <SelectField
            label="وحدة القياس"
            items={s_unit}
            register={{ ...register("s_unit") }}
          />
        </div>

        <InputField
          label="افل كمية قبل الطلب"
          placeholder="اقل كمية مسموحه  في المخزن."
          type="number"
          register={{ ...register("min") }}
        />

        <InputField
          label="اعلى كمية يسعها المخزن"
          placeholder="اعلى كمية مسموحه  في المخزن."
          type="number"
          register={{ ...register("max") }}
        />

        <div className="flex">
          <InputField
            label="سعر الشراء"
            type="number"
            placeholder="سعر الشراء."
            register={{ ...register("purchase_price") }}
          />

          <SelectField
            label="وحدة القياس"
            items={s_unit}
            register={{ ...register("a_unit") }}
          />
        </div>

        <div className="flex">
          <InputField
            label="سعر البيع"
            type="number"
            placeholder="سعر البيع."
            register={{ ...register("selling_price") }}
          />

          <SelectField
            label="وحدة القياس"
            items={s_unit}
            register={{ ...register("b_unit") }}
          />
        </div>

        <InputField
          label="باركود"
          placeholder="باركود"
          register={{ ...register("barcode") }}
        />

        <Button type="submit" className="btn w-full" loading={loading}>
          <span>حفظ</span>

          <IoIosSave />
        </Button>
      </form>
    </div>
  );
}
