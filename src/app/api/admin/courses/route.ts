import { NextResponse } from 'next/server';
import { generateUdemyAffiliateUrl } from '@/utils/affiliate';
import { Course } from '@/types/course';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { addCourse, deleteCourseById, getCatalog, getCourseById, updateCourseById } from '@/data/catalogStore';

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    courses: await getCatalog(),
  });
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      instructor,
      original_price,
      coupon_code,
      raw_udemy_url,
      image_url,
      duration,
      level,
      is_featured,
      expiry_hours,
    } = body;

    if (!title || !raw_udemy_url || !coupon_code) {
      return NextResponse.json(
        { success: false, error: 'Title, Udemy URL, and Coupon Code are required' },
        { status: 400 }
      );
    }

    const hours = parseInt(expiry_hours || '48', 10);
    const newCourse: Course = {
      id: `udemy-admin-${Date.now()}`,
      title,
      description: description || 'No description provided.',
      category: category || 'Development',
      instructor: instructor || 'Admin Curated',
      rating: 4.8,
      reviews_count: 1200,
      students_count: 15400,
      original_price: parseFloat(original_price || '99.99'),
      coupon_code,
      raw_udemy_url,
      destination_url: generateUdemyAffiliateUrl(raw_udemy_url, coupon_code, 'admin_portal'),
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + hours * 3600 * 1000).toISOString(),
      is_expired: false,
      is_featured: !!is_featured,
      report_count: 0,
      image_url: image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      level: level || 'All Levels',
      duration: duration || '10.0 total hours',
      language: 'English',
    };

    await addCourse(newCourse);

    return NextResponse.json({
      success: true,
      message: 'Course added successfully',
      course: newCourse,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, action } = await request.json();

    if (!(await getCourseById(id))) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const allowed = ['reset_reports', 'expire', 'unexpire', 'toggle_featured'];
    if (!allowed.includes(action)) {
      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }

    const course = await updateCourseById(id, (row) => {
      if (action === 'reset_reports') {
        row.report_count = 0;
        row.is_expired = false;
      } else if (action === 'expire') {
        row.is_expired = true;
      } else if (action === 'unexpire') {
        row.is_expired = false;
        row.report_count = 0;
        row.expires_at = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
      } else if (action === 'toggle_featured') {
        row.is_featured = !row.is_featured;
      }
    });

    return NextResponse.json({
      success: true,
      course,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    const removed = await deleteCourseById(id);
    if (!removed) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Course deleted' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 });
  }
}
