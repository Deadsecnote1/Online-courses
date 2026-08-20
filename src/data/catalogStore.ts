import { Course } from '@/types/course';
import { INITIAL_COURSES } from '@/data/mockCourses';
import { COURSES_COLLECTION, getAdminDb, isFirestoreEnabled } from '@/lib/firebaseAdmin';
import type { DocumentData } from 'firebase-admin/firestore';

let memory: Course[] = cloneSeed();
let seededFirestore = false;

function cloneSeed(): Course[] {
  return INITIAL_COURSES.map((c) => ({ ...c }));
}

function asCourse(data: DocumentData, id: string): Course {
  return { ...(data as Course), id: (data.id as string) || id };
}

async function ensureFirestoreSeeded(): Promise<void> {
  if (seededFirestore) return;
  const db = getAdminDb();
  const snap = await db.collection(COURSES_COLLECTION).limit(1).get();
  if (snap.empty) {
    const batch = db.batch();
    for (const course of cloneSeed()) {
      batch.set(db.collection(COURSES_COLLECTION).doc(course.id), course);
    }
    await batch.commit();
  }
  seededFirestore = true;
}

export async function getCatalog(): Promise<Course[]> {
  if (!isFirestoreEnabled()) return memory;

  await ensureFirestoreSeeded();
  const snap = await getAdminDb().collection(COURSES_COLLECTION).get();
  return snap.docs.map((doc) => asCourse(doc.data(), doc.id));
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  if (!isFirestoreEnabled()) return memory.find((c) => c.id === id);

  await ensureFirestoreSeeded();
  const doc = await getAdminDb().collection(COURSES_COLLECTION).doc(id).get();
  if (!doc.exists) return undefined;
  return asCourse(doc.data() as DocumentData, doc.id);
}

export async function addCourse(course: Course): Promise<Course> {
  if (!isFirestoreEnabled()) {
    memory.unshift(course);
    return course;
  }

  await getAdminDb().collection(COURSES_COLLECTION).doc(course.id).set(course);
  return course;
}

export async function updateCourseById(
  id: string,
  mutator: (course: Course) => void
): Promise<Course | null> {
  if (!isFirestoreEnabled()) {
    const course = memory.find((c) => c.id === id);
    if (!course) return null;
    mutator(course);
    return course;
  }

  const ref = getAdminDb().collection(COURSES_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const course = asCourse(snap.data() as DocumentData, snap.id);
  mutator(course);
  await ref.set(course);
  return course;
}

export async function deleteCourseById(id: string): Promise<boolean> {
  if (!isFirestoreEnabled()) {
    const index = memory.findIndex((c) => c.id === id);
    if (index === -1) return false;
    memory.splice(index, 1);
    return true;
  }

  const ref = getAdminDb().collection(COURSES_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}

/** Test helper — memory catalog only. */
export function resetCatalog(): void {
  memory = cloneSeed();
  seededFirestore = false;
}

export function catalogDriver(): 'firestore' | 'memory' {
  return isFirestoreEnabled() ? 'firestore' : 'memory';
}
