# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_17_130243) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "ff_mpeg_slices", force: :cascade do |t|
    t.bigint "ff_mpeg_id"
    t.float "start_time"
    t.float "end_time"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "order_in_sequence"
    t.index ["ff_mpeg_id"], name: "index_ff_mpeg_slices_on_ff_mpeg_id"
  end

  create_table "ff_mpegs", force: :cascade do |t|
    t.bigint "pattern_id"
    t.jsonb "pattern_blueprints"
    t.boolean "failed"
    t.jsonb "erros"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "project_tempfile_url"
    t.string "processed_tempfile_url"
    t.jsonb "pattern_concat_blueprints"
    t.jsonb "clip_filenames"
    t.string "font_tempfile_path"
    t.string "clip_tempfile_path"
    t.jsonb "text_blueprints"
    t.index ["pattern_id"], name: "index_ff_mpegs_on_pattern_id"
  end

  create_table "fonts", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "pattern_clips", force: :cascade do |t|
    t.jsonb "data"
    t.jsonb "used_notes"
    t.bigint "project_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_pattern_clips_on_project_id"
  end

  create_table "patterns", force: :cascade do |t|
    t.jsonb "midi_events"
    t.jsonb "note_stamps"
    t.bigint "project_id"
    t.float "pattern_length_in_seconds"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "channel"
    t.string "name"
    t.integer "step_length"
    t.integer "order_in_sequence"
    t.integer "total_clock_signals"
    t.jsonb "note_texts"
    t.jsonb "text_stamps"
    t.index ["project_id"], name: "index_patterns_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "bars"
    t.integer "bpm"
    t.jsonb "midi_dump"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
    t.boolean "sound_stripped"
    t.integer "lofi_amount"
    t.boolean "lofi_processed"
    t.integer "video_id"
    t.boolean "text"
    t.integer "font_id"
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "videos", force: :cascade do |t|
    t.string "file_type"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "user_id"
    t.boolean "sound_stripped"
    t.string "role"
    t.integer "parent_video_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
end
