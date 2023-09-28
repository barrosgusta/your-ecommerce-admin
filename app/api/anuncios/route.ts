import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { brand, model, year, fuel, kms, description, stage, price, isTurbo, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!brand) {
      return new NextResponse("Brand is required", { status: 400 });
    }

    if (!model) {
      return new NextResponse("Model is required", { status: 400 });
    }

    if (!year) {
      return new NextResponse("Year is required", { status: 400 });
    }

    if (!fuel) {
      return new NextResponse("Fuel is required", { status: 400 });
    }

    if (!kms) {
      return new NextResponse("Kms is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!stage) {
      return new NextResponse("Stage is required", { status: 400 });
    }

    const ad = await prismadb.carAd.create({
      data: {
        sellerId: userId,
        brand,
        model,
        year,
        fuel,
        kms,
        description,
        stage,
        price,
        isTurbo,
        isFeatured,
        isArchived,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });
  
    return NextResponse.json(ad);
  } catch (error) {
    console.log('[ANUNCIOS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};