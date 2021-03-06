class AuditLogsController < ApplicationController
  before_filter :require_moderator, only: [:edit, :update]
  before_filter :set_rss_false

  def index
    @audit_logs = AuditLog.all.includes(:moderator).order(:created_at => :desc).limit(100)
    # TODO: paginate
  end

  def edit
    load_log
  end

  def update

    load_log

    @log.note = params[:note]

    if @log.save!
      redirect_to(params[:redirect_url] || '/audit')
    else
      @errors = @log.errors
      render :edit
    end
  end

  protected
  def load_log
    @log = AuditLog.where(id: params[:id]).first
  end

  def require_moderator
    unless current_user.try(:moderator?)
      flash[:alert] = "Only moderators can access this page."
      redirect_to "/"
    end
  end

  # NOTE: in application.html.haml, it tries to
  # autogenerate RSS and ATOM links.  But navigating
  # to the audit log controller, that breaks.
  # this is a hack to fix it.
  def set_rss_false
    @rss = false
  end
end
