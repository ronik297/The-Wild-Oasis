import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  console.log("newCabin", newCabin);

  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create a cabin
  let query = supabase.from("cabins");

  // A) Create
  if (!id)
    query = query.insert([
      {
        name: newCabin.name,
        description: newCabin.description,
        maxCapacity: newCabin.maxCapacity,
        regularPrice: newCabin.regularPrice,
        discount: newCabin.discount,
        image: imagePath,
      },
    ]);

  // B) Edit
  if (id) {
    query = query
      .update({
        name: newCabin.name,
        description: newCabin.description,
        maxCapacity: newCabin.maxCapacity,
        regularPrice: newCabin.regularPrice,
        discount: newCabin.discount,
        image: imagePath,
      })
      .eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error || error.message);
    throw new Error("Cabins could not be loaded");
  }

  // 2. Upload image
  if (hasImagePath) return data;

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
