import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createCabin(newCabin) {
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //https://nqcurzqtgfbzobwhlqyv.supabase.co/storage/v1/object/public/cabin-images//cabin-001.jpg

  // 1. Create a cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([
      {
        name: newCabin.name,
        description: newCabin.description,
        maxCapacity: newCabin.maxCapacity,
        regularPrice: newCabin.regularPrice,
        discount: newCabin.discount,
        image: imagePath,
      },
    ])
    .select();

  console.log("data", data, "error", error);
  console.log("newCabin", newCabin);

  if (error) {
    console.log(error || error.message);
    throw new Error("Cabins could not be loaded");
  }

  // 2. Upload image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin If there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}
